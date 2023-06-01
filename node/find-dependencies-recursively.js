const fs = require('fs');
const path = require('path');

const foundDependencies = new Set();

// Función recursiva para buscar archivos package.json en el proyecto
const findPackageFiles = (dir, searchString) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findPackageFiles(filePath, searchString);
    } else if (file === 'package.json') {
      const packageData = fs.readFileSync(filePath, 'utf8');
      const packageJson = JSON.parse(packageData);
      const dependencies = packageJson.dependencies || {};
      const devDependencies = packageJson.devDependencies || {};

      // Buscar dependencias que comiencen por searchString
      for (const [dependency, version] of Object.entries(dependencies)) {
        if (dependency.startsWith(searchString)) {
          foundDependencies.add(`${dependency}@${version}`);
        }
      }

      // Buscar dependencias de desarrollo que comiencen por searchString
      for (const [dependency, version] of Object.entries(devDependencies)) {
        if (dependency.startsWith(searchString)) {
          foundDependencies.add(`${dependency}@${version}`);
        }
      }
    }
  }
};

// Ejecutar la búsqueda de archivos y dependencias
findPackageFiles('./argos', '@vaadin');

// Imprimir las dependencias encontradas
console.log(Array.from(foundDependencies));
