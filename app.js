const selector = document.getElementById("selector");
const botonGenerar = document.getElementById("button");
const botonDescargar = document.getElementById("descargar");

const paleta = document.getElementById("paleta");
const listaColores = document.getElementById("listaColores");
const aviso = document.getElementById("aviso");

let colores = [];


/* =========================
   GENERAR HSL
========================= */

function generarHSL() {

    const h = Math.floor(Math.random() * 360);

    // Rangos controlados para obtener colores
    // visualmente agradables
    const s = Math.floor(Math.random() * 31) + 55;
    const l = Math.floor(Math.random() * 31) + 35;

    return {
        h,
        s,
        l
    };
}


/* =========================
   HSL → RGB
========================= */

function hslToRgb(h, s, l) {

    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}


/* =========================
   RGB → HEX
========================= */

function rgbToHex(r, g, b) {

    return "#" + [r, g, b]
        .map(valor => valor.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
}


/* =========================
   CREAR UN COLOR
========================= */

function crearColor() {

    const hsl = generarHSL();

    const rgb = hslToRgb(
        hsl.h,
        hsl.s,
        hsl.l
    );

    const hex = rgbToHex(
        rgb.r,
        rgb.g,
        rgb.b
    );

    return {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        hex
    };
}


/* =========================
   GENERAR PALETA
========================= */

function generarPaleta() {

    const cantidad = Number(selector.value);

    colores = [];

    for (let i = 0; i < cantidad; i++) {
        colores.push(crearColor());
    }

    renderizarPaleta();
    renderizarInformacion();
}


/* =========================
   MOSTRAR PALETA
========================= */

function renderizarPaleta() {

    paleta.innerHTML = "";

    paleta.style.setProperty(
        "--cantidad",
        colores.length
    );

    colores.forEach((color, indice) => {

        const elemento = document.createElement("div");

        elemento.className = "color animar";

        elemento.style.backgroundColor = color.hex;

        elemento.style.animationDelay =
            `${indice * 35}ms`;

        const hex = document.createElement("span");

        hex.className = "hex-hover";
        hex.textContent = color.hex;

        elemento.appendChild(hex);

        /*
         * Al hacer clic sobre cualquier segmento
         * se copia su HEX.
         */
        elemento.addEventListener("click", () => {
            copiarTexto(color.hex);
        });

        paleta.appendChild(elemento);
    });
}


/* =========================
   INFORMACIÓN DE COLORES
========================= */

function renderizarInformacion() {

    listaColores.innerHTML = "";

    colores.forEach((color, indice) => {

        const fila = document.createElement("div");

        fila.className = "fila-color";

        /* Muestra */

        const muestra = document.createElement("div");

        muestra.className = "muestra";
        muestra.style.backgroundColor = color.hex;

        /* HSL */

        const hsl = document.createElement("span");

        hsl.className = "codigo";

        hsl.textContent =
            `HSL(${color.h}, ${color.s}%, ${color.l}%)`;

        hsl.title = "Copiar HSL";

        hsl.addEventListener("click", () => {

            copiarTexto(
                `hsl(${color.h}, ${color.s}%, ${color.l}%)`
            );

        });

        /* HEX */

        const hex = document.createElement("span");

        hex.className = "codigo";

        hex.textContent = color.hex;

        hex.title = "Copiar HEX";

        hex.addEventListener("click", () => {

            copiarTexto(color.hex);

        });

        fila.appendChild(muestra);
        fila.appendChild(hsl);
        fila.appendChild(hex);

        listaColores.appendChild(fila);
    });
}


/* =========================
   COPIAR TEXTO
========================= */

async function copiarTexto(texto) {

    try {

        if (navigator.clipboard) {

            await navigator.clipboard.writeText(texto);

        } else {

            copiarConFallback(texto);

        }

        mostrarAviso(`¡Copiado! ${texto}`);

    } catch (error) {

        copiarConFallback(texto);

        mostrarAviso(`¡Copiado! ${texto}`);
    }
}


/* =========================
   FALLBACK PARA COPIAR
========================= */

function copiarConFallback(texto) {

    const textarea = document.createElement("textarea");

    textarea.value = texto;

    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    textarea.remove();
}


/* =========================
   AVISO VISUAL
========================= */

let avisoTimeout;

function mostrarAviso(mensaje) {

    aviso.textContent = mensaje;

    aviso.classList.add("mostrar");

    clearTimeout(avisoTimeout);

    avisoTimeout = setTimeout(() => {

        aviso.classList.remove("mostrar");

    }, 1800);
}


/* =========================
   DESCARGAR PALETA
========================= */

function descargarPaleta() {

    if (colores.length === 0) {
        return;
    }

    /*
     * Ancho fijo y alto proporcional
     * a la cantidad de colores.
     */
    const ancho = 500;

    const altoPorColor = 180;

    const alto = colores.length * altoPorColor;

    const canvas = document.createElement("canvas");

    canvas.width = ancho;
    canvas.height = alto;

    const ctx = canvas.getContext("2d");

    const altoColor = alto / colores.length;

    colores.forEach((color, indice) => {

        ctx.fillStyle = color.hex;

        ctx.fillRect(
            0,
            indice * altoColor,
            ancho,
            altoColor + 1
        );
    });

    canvas.toBlob((blob) => {

        if (!blob) {
            return;
        }

        const url = URL.createObjectURL(blob);

        const enlace = document.createElement("a");

        enlace.href = url;

        enlace.download =
            `paleta-${colores.length}-colores.png`;

        document.body.appendChild(enlace);

        enlace.click();

        enlace.remove();

        URL.revokeObjectURL(url);

    }, "image/png");
}


/* =========================
   EVENTOS
========================= */

botonGenerar.addEventListener(
    "click",
    generarPaleta
);

botonDescargar.addEventListener(
    "click",
    descargarPaleta
);


/*
 * Al cambiar el selector NO se genera
 * una nueva paleta.
 *
 * Hay que pulsar "Generar paleta".
 */


/* =========================
   PALETA INICIAL
========================= */

generarPaleta();