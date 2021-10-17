module.exports = (authService) => {
    return (req, res, next) => {
      console.log('authMiddleware accessed')
      const authHeader = req.headers.authorization
      const token = authHeader && authHeader.split(' ')[1]
      if (token) {
        const uid = authService.verifyToken(token)
        // if uid is not null, then authHeader corresponds to existing user
        if (uid !== null) {
          req.uid = uid
          console.log('authMiddleware cleared')
          return next()
        }
      }
      res.status(401).send('Unauthorized')
    }
  }