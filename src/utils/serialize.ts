import { Timestamp } from "firebase/firestore";

// Function to recursively serialize Firebase Timestamp properties
export function serializeDocs(
  data: any,
  seen: WeakSet<object> = new WeakSet(),
): any {
  // If data is null or undefined, return it as-is
  if (data === null || data === undefined) {
    return data;
  }

  // Check if the current data is a Timestamp and serialize it
  if (data instanceof Timestamp) {
    return data.toDate().toISOString(); // or use data.toMillis() if you want milliseconds
  }

  // If data is an array, serialize each element
  if (Array.isArray(data)) {
    return data.map(item => serializeDocs(item, seen));
  }

  // If data is an object, serialize its properties
  if (typeof data === "object") {
    // Avoid circular references by checking if the object has already been seen
    if (seen.has(data)) {
      return; // Stop serialization if circular reference is detected
    }

    // Add the current object to the set of seen objects
    seen.add(data);

    const serializedObject: { [key: string]: any } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        serializedObject[key] = serializeDocs(data[key], seen);
      }
    }

    // Return the serialized object
    return JSON.parse(JSON.stringify(serializedObject));
  }

  // For primitive types, return the data as-is
  return data;
}
