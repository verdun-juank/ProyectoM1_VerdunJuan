// Elementos del HTML
const selector = document.getElementById("selector");
const button = document.getElementById("button");
const paleta = document.getElementById("paleta");


// Genera un número aleatorio entre mínimo y máximo
function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Convierte HSL a RGB
function hslToRgb(h, s, l) {

    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;

    const a = s * Math.min(l, 1 - l);

    const f = n =>
        l - a * Math.max(
            -1,
            Math.min(
                k(n) - 3,
                Math.min(9 - k(n), 1)
            )
        );

    return {
        r: Math.round(255 * f(0)),
        g: Math.round(255 * f(8)),
        b: Math.round(255 * f(4))
    };
}


// Convierte RGB a RGBA
function rgbToRgba(rgb, alpha = 1) {

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}


// Genera un color aleatorio en HSL
function generarColor() {

    const h = numeroAleatorio(0, 360);
    const s = numeroAleatorio(50, 90);
    const l = numeroAleatorio(35, 70);

    const hsl = `hsl(${h}, ${s}%, ${l}%)`;

    const rgb = hslToRgb(h, s, l);

    const rgba = rgbToRgba(rgb);

    return {
        h,
        s,
        l,
        hsl,
        rgba
    };
}


// Crea una tarjeta de color
function crearColor(color) {

    const tarjeta = document.createElement("article");

    tarjeta.classList.add("color");


    // Muestra del color
    const muestra = document.createElement("div");

    muestra.classList.add("color__muestra");

    muestra.style.backgroundColor = color.rgba;


    // Información
    const informacion = document.createElement("div");

    informacion.classList.add("color__informacion");


    // Código HSL
    const codigoHsl = crearCodigo(
        "HSL",
        color.hsl
    );


    // Código RGBA
    const codigoRgba = crearCodigo(
        "RGBA",
        color.rgba
    );


    informacion.appendChild(codigoHsl);
    informacion.appendChild(codigoRgba);

    tarjeta.appendChild(muestra);
    tarjeta.appendChild(informacion);

    return tarjeta;
}


// Crea una fila con código + botón copiar
function crearCodigo(nombre, valor) {

    const contenedor = document.createElement("div");

    contenedor.classList.add("color__codigo");


    const texto = document.createElement("span");

    texto.classList.add("color__texto");

    texto.textContent = `${nombre}: ${valor}`;


    const botonCopiar = document.createElement("button");

    botonCopiar.classList.add("color__copiar");

    botonCopiar.textContent = "Copiar";


    botonCopiar.addEventListener("click", async () => {

        try {

            await navigator.clipboard.writeText(valor);

            botonCopiar.textContent = "Copiado";

            setTimeout(() => {
                botonCopiar.textContent = "Copiar";
            }, 1000);

        } catch (error) {

            console.error(
                "No se pudo copiar el código:",
                error
            );

        }

    });


    contenedor.appendChild(texto);
    contenedor.appendChild(botonCopiar);

    return contenedor;
}


// Genera la paleta
function generarPaleta() {

    paleta.innerHTML = "";


    // Obtenemos el valor del select
    const cantidad = Number(selector.value);

    // Generamos los colores
    for (let i = 0; i < cantidad; i++) {

        const color = generarColor();

        const tarjeta = crearColor(color);

        paleta.appendChild(tarjeta);
    }
}


// Evento del botón
button.addEventListener(
    "click",
    generarPaleta
);


// Generar una paleta automáticamente
// al cargar la página
generarPaleta();