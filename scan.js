const fs = require('fs');
const os = require('os');

const raiz = '.';


function scanDir(dirPath, subDirs, gitIgnoreDirs) {
    const lstSubDir = subDirs || [];
    const lstGitdir = gitIgnoreDirs || [];
    const diretories = fs.readdirSync(dirPath);

    if (diretories && diretories.length) {
        diretories
            .filter(dir => fs.statSync(dirPath + '/' + dir).isDirectory())
            .forEach(dir => {
                try{
                    if (fs.statSync(dirPath + '/' + dir + '/.git')) {
                        lstGitdir.push(dirPath + '/' + dir)
                    }
                } catch (err) {
                    // do not need log errors.
                }
                lstSubDir.push(dir);
                scanDir(dirPath + '/' + dir, lstSubDir, lstGitdir);
            });
    }
    return lstGitdir;
}

function updateGitIgnore(folders, gitIgnoreFilePath) {
    try {
        if (fs.statSync(gitIgnoreFilePath)) {
            const writeStream = fs.createWriteStream(gitIgnoreFilePath);
            folders.forEach(i => writeStream.write(i + os.EOL));
            writeStream.end();
        }
    } catch (err) {
        console.error('ERRO::: ', err);
    }
}


const resultado = scanDir(raiz, []);

updateGitIgnore(resultado, raiz);