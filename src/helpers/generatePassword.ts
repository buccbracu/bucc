export default function generatePassword() {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*";
  const all = lowercase + uppercase + numbers + specialChars;

  const password = [];

  // Ensure the password contains at least one lowercase, one uppercase, one number, and one special character.
  password.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  password.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
  password.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
  password.push(numbers[Math.floor(Math.random() * numbers.length)]);

  // Fill the rest of the password to meet the 8-character length requirement.
  for (let i = 4; i < 8; i++) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Shuffle the password array to randomize character order.
  return password.sort(() => Math.random() - 0.5).join("");
}
