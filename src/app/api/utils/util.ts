export function excludeAttributes<T extends object>(
  body: T,
  attributesToExclude: (keyof T)[]
): Omit<T, keyof T> {
  const { ...filteredBody } = body; // Create a shallow copy of the body

  attributesToExclude.forEach((attr) => {
    if (attr in filteredBody) {
      delete filteredBody[attr]; // Remove the attribute if it exists
    }
  });

  return filteredBody; // Return the filtered object
}