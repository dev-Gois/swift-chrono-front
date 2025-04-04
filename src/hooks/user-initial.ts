export const userInitial = (name: string) => {
  if (!name) {
    return '';
  }
  const [firstName, lastName] = name.split(' ');

  if (!lastName) {
    return firstName[0].toUpperCase();
  }

  return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
}