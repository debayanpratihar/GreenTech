import mongoose from "mongoose";

let isConnected = false; // Ensure the connection is established only once

mongoose.set('strictQuery', false); // Optional, depending on your query style

export async function connect() {
    if (isConnected) {
        console.log("MongoDB is already connected.");
        return;
    }

    try {
        await mongoose.connect(
            process.env.NEXT_PUBLIC_MONGODB_URI || 
            "mongodb+srv://djbabu1623:green@cluster0.jt58a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            { dbName: "djbabu1623" }
        );

        const connection = mongoose.connection;

        // Increase the maximum number of listeners to avoid warnings
        connection.setMaxListeners(20);

        // Ensure there are no duplicate listeners by removing all before adding
        connection.removeAllListeners("connected");
        connection.removeAllListeners("error");

        // Attach listeners
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
            isConnected = true; // Mark as connected
        });

        connection.on("error", (err) => {
            console.log(
                "MongoDB connection error. Please make sure MongoDB is running. " + err
            );
            process.exit(1);
        });
    } catch (error) {
        console.log("Something went wrong!");
        console.log(error);
    }
}
