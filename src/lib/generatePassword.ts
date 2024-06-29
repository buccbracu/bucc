// Create a password with a length of 8 characters and at least one uppercase letter, one lowercase letter, one number, and one special character.
export default function generatePassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+";
  const all = lowercase + uppercase + numbers + special;
  const password = [];
  password.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  password.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  password.push(numbers[Math.floor(Math.random() * numbers.length)]);
  password.push(special[Math.floor(Math.random() * special.length)]);
  for (let i = 4; i < 8; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }
  return password.sort(() => Math.random() - 0.5).join("");
}
