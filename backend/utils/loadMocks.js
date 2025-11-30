const fs = require("fs");
const path = require("path");

const loadMockTests = () => {
  const mocksDir = path.join(__dirname, "../mock-data/jee");

  try {
    if (!fs.existsSync(mocksDir)) {
      console.log("Mock directory not found:", mocksDir);
      return [];
    }

    const files = fs.readdirSync(mocksDir);
    const jsonFiles = files.filter(f => f.endsWith(".json"));

    const mocks = jsonFiles.map(file => {
      const filePath = path.join(mocksDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(raw);

      return {
        id: file.replace(".json", ""),
        title: data.title || `JEE Mock ${file.replace(".json", "")}`,
        duration: data.duration || 180,
        totalQuestions: data.questions?.length || 90,
        subjects: data.subjects || ["Physics", "Chemistry", "Maths"],
        description: data.description || "Full syllabus JEE Main mock test",
      };
    });

    console.log(`Loaded ${mocks.length} mock tests`);
    return mocks;
  } catch (err) {
    console.error("Failed to load mocks:", err.message);
    return [];
  }
};

module.exports = loadMockTests;
