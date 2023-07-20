import {Router} from 'express'

const views = Router()

const estaLogueado = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  }

  next()
}

views.get('/login', estaLogueado, (req,res) => {
  res.render('login')
})

views.get('/', (req,res) => {
  res.render('index')
})


views.get('/register', estaLogueado, (req,res) => {
  res.render('register')
})

views.get('/profile', (req,res) => {
  if (!req.session.user) return res.redirect('/login') 
  res.render('profile', {user:req.session.user})
})


export default router;
