require("dotenv").config(); // Load .env from the current directory (backend/)
const mongoose = require("mongoose");
const connectDB = require("../config/db"); // Ajuste o caminho se necessário
const Job = require("../models/Job"); // Ajuste o caminho se necessário

// Dados de Exemplo (Crie dados mais diversos conforme necessário)
const jobs = [];
for (let i = 1; i <= 25; i++) {
    // Cria 25 vagas de exemplo
    jobs.push({
        title: `Sample Job Title ${i}`,
        description: `This is the description for sample job ${i}. It requires certain skills and offers great opportunities. We are looking for dedicated individuals.`,
        requiredSkills: [
            `skill${(i % 5) + 1}`,
            `skill${((i + 1) % 5) + 1}`,
            `common_skill`,
        ], // Skills de exemplo
    });
}

// Conecta ao BD
connectDB();

// Importa dados para o BD
const importData = async () => {
    try {
        // Limpa vagas existentes
        await Job.deleteMany();
        console.log("Jobs Destroyed!");

        // Insere vagas de exemplo
        await Job.insertMany(jobs);
        console.log("Jobs Imported!");
        process.exit();
    } catch (error) {
        console.error(`Error importing job data: ${error}`);
        process.exit(1);
    }
};

// Destrói dados do BD
const destroyData = async () => {
    try {
        await Job.deleteMany();
        console.log("Jobs Destroyed!");
        process.exit();
    } catch (error) {
        console.error(`Error destroying job data: ${error}`);
        process.exit(1);
    }
};

// Verifica argumento de linha de comando '-d' para destruir dados
if (process.argv[2] === "-d") {
    destroyData();
} else {
    importData();
}

// Garante desconexão em erros de terminação do script (opcional, mas boa prática)
process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("MongoDB disconnected on app termination");
    process.exit(0);
});
