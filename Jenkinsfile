
node(){
    stage('Cloning Git') {
        checkout scm
    }
    stage('Install dependencies') {
        nodejs('nodejs') {
            sh 'npm install --global yarn'
            sh 'yarn'
            echo "Modules installed"
            sh 'npm install -g @angular/cli@latest'
            echo "ANGULAR CLI"
        }
        
    }
    stage('Build') {
        nodejs('nodejs') {
            sh 'npm run build --prod'
            echo "Build completed"
        }
        
    }

    stage('Package Build') {
        sh "tar -zcvf bundle.tar.gz dist/diplom-frontend/"
    }

    stage('Artifacts Creation') {
        fingerprint 'bundle.tar.gz'
        archiveArtifacts 'bundle.tar.gz'
        echo "Artifacts created"
    }

    stage('Stash changes') {
        stash allowEmpty: true, includes: 'bundle.tar.gz', name: 'buildArtifacts'
    }
}

node('frontendNode') {
    echo 'Unstash'
    unstash 'buildArtifacts'
    echo 'Artifacts copied'

    echo 'Copy'
    sh "yes | sudo cp -R bundle.tar.gz /var/www/html && cd /var/www/html && sudo tar -xvf bundle.tar.gz"
    echo 'Copy completed'
}