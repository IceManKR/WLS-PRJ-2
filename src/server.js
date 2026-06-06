import app from './app.js'
import { config } from './config/env.js'

const PORT = config.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    if (app.router && Array.isArray(app.router.stack)) {
        const routes = app.router.stack
            .filter((layer) => layer.route)
            .map((layer) => `${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`)
        console.log('Registered routes:')
        routes.forEach((route) => console.log(`  ${route}`))
    }
})