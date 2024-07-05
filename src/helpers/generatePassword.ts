export default function generatePassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const all = lowercase + numbers;
  const password = [];
  password.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  password.push(numbers[Math.floor(Math.random() * numbers.length)]);
  for (let i = 4; i < 8; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }
  return password.sort(() => Math.random() - 0.5).join("");
}
