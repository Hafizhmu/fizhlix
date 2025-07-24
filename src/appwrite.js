import { Client, Databases, ID, Query } from "appwrite";

const project_id = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const database_id = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collection_id = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client().setEndpoint(endpoint).setProject(project_id);

const database = new Databases(client);

// export const updateSearchCount = async (searchTerm, movie) => {
//   try {
//     const response = await database.listDocuments(database_id, collection_id, [
//       Query.equal("search_term", searchTerm),
//     ]);
//     if (response.documents.length > 0) {
//       const doc = response.documents[0];

//       await database.updateDocument(database_id, collection_id, doc.$id, {
//         count: doc.count + 1,
//       });
//     } else {
//       await database.createDocument(database_id, collection_id, ID.unique(), {
//         searchTerm,
//         count: 1,
//         movie_id: movie.id,
//         poster_url: movie.poster_path,
//       });
//       console.log("🔍 Movie to save:", movie);
//     }
//   } catch (error) {
//     console.error("Error updating search count:", error);
//   }
// };
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    console.log("🔁 updateSearchCount called", { searchTerm, movie });

    const response = await database.listDocuments(database_id, collection_id, [
      Query.equal("searchTerm", searchTerm), // pastikan field sesuai
    ]);

    console.log("📄 ListDocuments result:", response);

    if (response.documents.length > 0) {
      const doc = response.documents[0];

      await database
        .updateDocument(database_id, collection_id, doc.$id, {
          count: doc.count + 1,
        })
        .then((res) => console.log("✅ Document updated:", res))
        .catch((err) => console.error("❌ Error update:", err));
    } else {
      await database
        .createDocument(database_id, collection_id, ID.unique(), {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        })
        .then((res) => console.log("✅ Document created:", res))
        .catch((err) => console.error("❌ Error create:", err));
    }
  } catch (error) {
    console.error("❌ General error in updateSearchCount:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await database.listDocuments(database_id, collection_id, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return response.documents;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};
