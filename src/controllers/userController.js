const fs = require ('fs');
const path = require('path')
const bcrypt = require('bcryptjs');

const rutaJSON = path.join(__dirname, 'usersDataBase.json');
const listaUsersJSON = fs.readFileSync(rutaJSON, 'utf-8') || '[]';
const listaUsersJS = JSON.parse (listaUsersJSON);


const userController = {

    // Vista regisrtarme (/users/create)
    vistaRegister: (req, res)=> {

        res.render('register', {view: 'other'});
    },

    // Método para crear usuario 
    register: (req, res, next)=> {

        if (req.body.password === req.body.passwordRepeat) {

            let newUser = {
                name: req.body.name,
                surname: req.body.surname, 
                username: req.body.name + req.body.surname,
                image: req.files[0].image,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password)
            };
            console.log(newUser);
            

            let newDB = [...listaUsersJS, newUser];
            let listaUsersNuevaJSON = JSON.stringify(newDB, null, ' ');
            fs.writeFileSync(rutaJSON, listaUsersNuevaJSON);
       
            res.redirect('/');
        } else { 

            res.render('register', {error: 'Usuario o contraseña invalida'})
        }
    },
    // Vista Login (/users/login)
    vistaLogin: (req, res)=> {

        res.render('login', {view: 'other'});
    },

    // Método para login 
    login: (req, res)=> {
        let userElegido = listaUsersJS.find(user => req.body.email == user.email);
        let autorizado = bcrypt.compareSync(req.body.password, userElegido.password);

        if (autorizado) {
            res.redirect('/users/profile/' + userElegido.name + userElegido.surname);
        } else {
            res.redirect('login');
            // {error: 'Usuario o contraseña invalida'}
        };
    },

    vistaProfile: (req, res)=> {

        let username = req.params.username;
        let userElegido = listaUsersJS.find(user => user.username === username);

        res.render('profile', {userElegido: userElegido, view: 'profile'});
    }
}

module.exports = userController;