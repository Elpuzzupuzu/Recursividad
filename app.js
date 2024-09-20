const express = require('express');
const cors = require('cors');  // Importar el paquete cors
const app = express();
const port = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors({
    origin: '*', // Permite solicitudes de cualquier origen. Cambia esto para restringir el acceso a dominios específicos si es necesario.
}));

// Endpoint para calcular el factorial
app.get('/factorial/:number', (req, res) => {
    const n = parseInt(req.params.number);
    
    function factorial(n) {
        if (n < 0) {
            return "El número debe ser mayor o igual a cero.";
        }
        if (n === 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }

    const result = factorial(n);
    res.json({ number: n, factorial: result });
});


    // Endpoint para calcular la potencia de un número
app.get('/potencia/:base/:exponente', (req, res) => {
    const base = parseFloat(req.params.base);
    const exponente = parseInt(req.params.exponente);

    function calcularPotencia(base, exponente) {
        if (exponente < 0) {
            return "El exponente debe ser un número no negativo.";
        }
        if (exponente === 0) {
            return 1;
        } else {
            return base * calcularPotencia(base, exponente - 1);
        }
    }

    const resultado = calcularPotencia(base, exponente);
    res.json({ base, exponente, resultado });
});




// Endpoint para calcular la serie de Fibonacci
app.get('/fibonacci/:number', (req, res) => {
    const n = parseInt(req.params.number);

    // Función para calcular la serie de Fibonacci hasta el n-ésimo número
    function fibonacciSerie(n) {
        if (n < 0) {
            return { error: "El número debe ser mayor o igual a cero." };
        }

        const serie = [];
        for (let i = 0; i <= n; i++) {
            if (i === 0) {
                serie.push(0);
            } else if (i === 1) {
                serie.push(1);
            } else {
                serie.push(serie[i - 1] + serie[i - 2]);
            }
        }
        return serie;
    }

    const serieCompleta = fibonacciSerie(n);
    const ultimoNumero = serieCompleta[n]; // Obtener el enésimo número de Fibonacci
    res.json({ number: n, fibonacci: ultimoNumero, serie: serieCompleta });
});


// Endpoint para calcular el cambio mínimo recursivamente

app.post('/cambio', (req, res) => {
    const { monto, pago } = req.body;
    const denominaciones = [100, 50, 20, 10, 5, 1, 0.50, 0.20, 0.10, 0.01];
    
    let cantidad = parseFloat(pago) - parseFloat(monto);

    if (cantidad < 0) {
        return res.json({ error: "El monto de pago es insuficiente." });
    }
    
    function calcularCambio(cantidad, index = 0, resultado = {}, listaDeMonedas = []) {
        if (cantidad <= 0 || index >= denominaciones.length) {
            return { resultado, listaDeMonedas };
        }

        const denominacion = denominaciones[index];
        const numeroDeMonedas = Math.floor(cantidad / denominacion);
        
        if (numeroDeMonedas > 0) {
            resultado[denominacion] = numeroDeMonedas;
            for (let i = 0; i < numeroDeMonedas; i++) {
                listaDeMonedas.push(denominacion);
            }
            cantidad = (cantidad - numeroDeMonedas * denominacion).toFixed(2);
        }

        // Llamada recursiva con la siguiente denominación
        return calcularCambio(cantidad, index + 1, resultado, listaDeMonedas);
    }

    const { resultado: cambio, listaDeMonedas } = calcularCambio(cantidad);
    const totalMonedas = listaDeMonedas.length;
    res.json({ 
        monto: parseFloat(monto), 
        pago: parseFloat(pago), 
        cambio, 
        listaDeMonedas,
        montoCambio: cantidad.toFixed(2),
        totalMonedas
    });
});




// Endpoint para resolver las Torres de Hanoi
app.get('/hanoi/:n', (req, res) => {
    const n = parseInt(req.params.n);
    let movimientos = [];

    function hanoi(n, origen, destino, auxiliar) {
        if (n === 1) {
            movimientos.push(`Mover disco 1 de ${origen} a ${destino}`);
        } else {
            hanoi(n - 1, origen, auxiliar, destino);
            movimientos.push(`Mover disco ${n} de ${origen} a ${destino}`);
            hanoi(n - 1, auxiliar, destino, origen);
        }
    }

    // Iniciar el proceso con las torres A, B, y C
    hanoi(n, 'A', 'C', 'B');

    res.json({ discos: n, movimientos });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
