const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
require('dotenv').config();

const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology", 
  "Computer Science", "History", "Geography", 
  "English", "Economics", "German"
];

const firstNames = [
  "Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Benjamin", "Mia",
  "Lucas", "Sophia", "Henry", "Amelia", "Theodore", "Charlotte", "Jack", "Aria", "Levi", "Luna",
  "Alexander", "Grace", "Owen", "Chloe", "Sebastian", "Camila", "Ethan", "Penelope", "Samuel", "Layla",
  "Leo", "Nora", "Julian", "Hazel", "Hudson", "Lily", "Lincoln", "Aurora", "Gabriel", "Ellie",
  "Mateo", "Stella", "Ryan", "Natalie", "Asher", "Zoe", "Nathan", "Leah", "Isaac", "Hazel",
  "Andrew", "Violet", "Joshua", "Mila", "Christopher", "Lucy", "Josiah", "Anna", "Caleb", "Maya"
];

const lastNames = [
  "Smith", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez",
  "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez",
  "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
  "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
  "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips"
];

// Helper function to get random items from the subject array
const getRandomSubjects = (count, exclude = []) => {
    const available = subjects.filter(s => !exclude.includes(s));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await User.deleteMany();
        
        const hashedPassword = await bcrypt.hash("password123", 10);
        let users = [];

        for (let i = 0; i < 1000; i++) { // Increased to 120 for even more variety
            const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
            
            // Randomly decide if this user is a "Specialist" (1 subject) or "Generalist" (2-3 subjects)
            const strongCount = Math.random() > 0.8 ? 2 : 1;
            const weakCount = Math.random() > 0.8 ? 2 : 1;

            const myStrong = getRandomSubjects(strongCount);
            const myWeak = getRandomSubjects(weakCount, myStrong); // Ensure they don't want help in what they are good at!

            users.push({
                name: `${fName} ${lName}`,
                email: `student${i}@gisma-university.com`,
                password: "password123",
                strongSubjects: myStrong,
                weakSubjects: myWeak
            });
        }

        await User.insertMany(users);
        console.log("✅ 1000 Users seeded!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedUsers();