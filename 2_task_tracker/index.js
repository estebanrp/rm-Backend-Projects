#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const args = process.argv.slice(2)

const tasksFilePath = path.join(__dirname, "/data.json")


// Cargar las tareas desde el archivo (si existe)
let tareas = [];
if (fs.existsSync(tasksFilePath)) {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf8");
    tareas = JSON.parse(data) || []; // Verificar que no sea null o undefined
  } catch (error) {
    console.error("Error al leer o analizar el archivo JSON:", error.message);
    tareas = []; // Inicializar con una lista vacía si falla
  }
} else {
  // Crear el archivo con un JSON vacío si no existe
  fs.writeFileSync(tasksFilePath, JSON.stringify([], null, 2));
}

// Obtener argumentos de línea de comando


if (args.length === 0) {
	console.log("Bienvenido a Tareas. Usa un comando como 'add', 'update', o 'delete'.");
} else {
	const command = args[0];

	if (command === "add") {
		// Agregar una tarea
		const description = args[1] || "Tarea sin descripción";
		const newTask = {
			id: tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1,
			description,
			status: "todo",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		tareas.push(newTask);
		console.log("Tarea agregada:", newTask);

		fs.writeFileSync(tasksFilePath, JSON.stringify(tareas, null, 2));

	} else if (command === "update") {
		// Actualizar una tarea
		const id = parseInt(args[1], 10);
		const newStatus = args[2];
		const task = tareas.find((t) => t.id === id);

		if (task) {
			task.status = newStatus || task.status;
			task.updatedAt = new Date();
			console.log("Tarea actualizada:", task);
			fs.writeFileSync(tasksFilePath, JSON.stringify(tareas, null, 2))
		} else {
			console.log("Tarea no encontrada.");
		}

	} else if (command === "delete") {
		// Eliminar una tarea
		const id = parseInt(args[1], 10);
		const index = tareas.findIndex((t) => t.id === id);

		if (index !== -1) {
			const deletedTask = tareas.splice(index, 1);
			console.log("Tarea eliminada:", deletedTask);
			fs.writeFileSync(tasksFilePath, JSON.stringify(tareas, null, 2))
		} else {
			console.log("Tarea no encontrada.");
		}

	} else if (command === "list") {
		tareas.forEach(tarea => {
			console.log(`ID: ${tarea.id}, St: ${tarea.status}, Tarea: ${tarea.description}`);
		})

	} else {
		console.log("Comando no reconocido. Usa 'add', 'update' o 'delete'.");
	}
}

