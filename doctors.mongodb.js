// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("lavis");

const names = [
  "Sunil Sheshadri",
  "Talo Kurian",
  "Shobha H S",
  "Shashidhar S",
  "Vani N",
  "Channakeshava Chowdaiah",
  "Nafees Shaikh",
  "Dr Vinita Gupta",
  "Anil Kumar",
  "Indranil Chakraborty",
  "Jai Bharat Bhalke",
  "Zubair Hasan",
  "Hina Khaleel",
  "Sathi Das",
  "Aparna",
  "Mujaver Arifulla",
  "Dr Jyothsnaben Kapadia",
  "Suvarnajyothi Ganta",
  "Suneetha Kurella",
  "Dr J Arvind Kumar",
  "Shipra Sonkusare",
  "Shankarappa Kabber",
];

const designations = [
  "MD",
  "Dentist",
  "Gynecologist",
  "Cardiologist",
  "Endocrinologist",
  "Oncologist",
  "Paediatrician",
  "Physician",
  "Psychiatrist",
];

const random = (array) => {
  const rand = Math.floor(Math.random() * array.length);
  return array[rand];
};

names.forEach((doctor, index) => {
  const email =
    doctor.trim().replace(/\s/g, "").toLocaleLowerCase() + "@mail.org";
  const avatar =
    random(["male", "female"]) + "-" + String(index).padStart(2, "0");
  const designation = random(designations);

  // Create a new document in the collection.
  db.getCollection("users").insertOne({
    username: email,
    password: "$2b$10$xuhOGd7PUuEBj1UAUHSYyeDC5aJpDyT7qmZnGxMjgliejqcrg46FS",
    role: "doctor",
    data: {
      displayName: doctor,
      photoURL: "assets/images/avatars/" + avatar + ".jpg",
      email: email,
      shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts"],
      address: "Hyderabad, India",
      title: designation,
      company: "Appollo",
    },
  });
});
