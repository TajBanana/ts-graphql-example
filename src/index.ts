import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

interface Book {
    id: string;
    title: string;
    author: string;
}

interface Review {
    id: string;
    content: string;
    book_id: string;
}
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String
    author: String
    reviews: [Review!]
  }
  type Review {
    id: ID!
    content: String!
    book_id: String!
    book: Book!
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    reviews: [Review]
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
        id: "1"
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
        id: "2"
    },
];

const reviews = [
    {
        id: "1",
        content: "this is a good book",
        book_id: "1"
    },
    {
        id: "2",
        content: "this is not a good book",
        book_id: "2"
    }
]

const db = { books, reviews }

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => db.books,
        reviews: () => db.reviews
    },
    Book: {
        reviews(parent: Book) {
            return db.reviews.filter(review => review.book_id === parent.id)
        }
    },
    Review: {
        book(parent: Review) {
            return db.books.find(book => book.id === parent.book_id)
        } 
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
})

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
