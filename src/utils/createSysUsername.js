const adjectives = [
  "Swift", "Clever", "Brave", "Merry", "Lively", "Witty", "Jolly", "Breezy",
  "Charming", "Noble", "Vibrant", "Daring", "Peppy", "Quirky", "Snappy", "Zesty",
];

const animals = [
  "Chinchilla", "Panda", "Dolphin", "Otter", "Meerkat", "Kangaroo", "Cheetah", "Penguin",
  "Lemur", "Armadillo", "Giraffe", "Hedgehog", "Toucan", "Koala", "Falcon", "Walrus",
];

function createSysUsername() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(Math.random() * 100); // Optional number suffix
  return `${adj}${animal}${number}`;
}

export default createSysUsername;
