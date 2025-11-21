// --- BASE DE DATOS (JSON COMPLETO) ---
const vocabulario = [
    { "palabra": "yo", "traduccion_ingles": "I" },
    { "palabra": "tú", "traduccion_ingles": "you (singular informal)" },
    { "palabra": "él", "traduccion_ingles": "he" },
    { "palabra": "ella", "traduccion_ingles": "she" },
    { "palabra": "usted", "traduccion_ingles": "you (singular formal)" },
    { "palabra": "nosotros", "traduccion_ingles": "we (masculine/mixed)" },
    { "palabra": "nosotras", "traduccion_ingles": "we (feminine)" },
    { "palabra": "vosotros", "traduccion_ingles": "you (plural informal masculine/mixed)" },
    { "palabra": "vosotras", "traduccion_ingles": "you (plural informal feminine)" },
    { "palabra": "ellos", "traduccion_ingles": "they (masculine/mixed)" },
    { "palabra": "ellas", "traduccion_ingles": "they (feminine)" },
    { "palabra": "ustedes", "traduccion_ingles": "you (plural formal/informal Latin America)" },
    { "palabra": "español", "traduccion_ingles": "Spanish (nationality)" },
    { "palabra": "española", "traduccion_ingles": "Spanish (nationality)" },
    { "palabra": "mexicano", "traduccion_ingles": "Mexican" },
    { "palabra": "mexicana", "traduccion_ingles": "Mexican" },
    { "palabra": "francés", "traduccion_ingles": "French" },
    { "palabra": "francesa", "traduccion_ingles": "French" },
    { "palabra": "estadounidense", "traduccion_ingles": "American (USA)" },
    { "palabra": "canadiense", "traduccion_ingles": "Canadian" },
    { "palabra": "inglés", "traduccion_ingles": "English" },
    { "palabra": "inglesa", "traduccion_ingles": "English" },
    { "palabra": "alemán", "traduccion_ingles": "German" },
    { "palabra": "alemana", "traduccion_ingles": "German" },
    { "palabra": "italiano", "traduccion_ingles": "Italian" },
    { "palabra": "italiana", "traduccion_ingles": "Italian" },
    { "palabra": "chino", "traduccion_ingles": "Chinese" },
    { "palabra": "china", "traduccion_ingles": "Chinese" },
    { "palabra": "japonés", "traduccion_ingles": "Japanese" },
    { "palabra": "japonesa", "traduccion_ingles": "Japanese" },
    { "palabra": "coreano", "traduccion_ingles": "Korean" },
    { "palabra": "coreana", "traduccion_ingles": "Korean" },
    { "palabra": "hola", "traduccion_ingles": "hello / hi" },
    { "palabra": "adiós", "traduccion_ingles": "goodbye" },
    { "palabra": "gracias", "traduccion_ingles": "thank you" },
    { "palabra": "perdón", "traduccion_ingles": "sorry / excuse me" },
    { "palabra": "encantado", "traduccion_ingles": "pleased to meet you (male)" },
    { "palabra": "encantada", "traduccion_ingles": "pleased to meet you (female)" },
    { "palabra": "qué", "traduccion_ingles": "what" },
    { "palabra": "quién", "traduccion_ingles": "who (singular)" },
    { "palabra": "dónde", "traduccion_ingles": "where" },
    { "palabra": "cuándo", "traduccion_ingles": "when" },
    { "palabra": "cómo", "traduccion_ingles": "how" },
    { "palabra": "familia", "traduccion_ingles": "family" },
    { "palabra": "padre", "traduccion_ingles": "father" },
    { "palabra": "madre", "traduccion_ingles": "mother" },
    { "palabra": "padres", "traduccion_ingles": "parents" },
    { "palabra": "hijo", "traduccion_ingles": "son" },
    { "palabra": "hija", "traduccion_ingles": "daughter" },
    { "palabra": "hermano", "traduccion_ingles": "brother" },
    { "palabra": "hermana", "traduccion_ingles": "sister" },
    { "palabra": "abuelo", "traduccion_ingles": "grandfather" },
    { "palabra": "abuela", "traduccion_ingles": "grandmother" },
    { "palabra": "tío", "traduccion_ingles": "uncle" },
    { "palabra": "tía", "traduccion_ingles": "aunt" },
    { "palabra": "primo", "traduccion_ingles": "cousin (male)" },
    { "palabra": "prima", "traduccion_ingles": "cousin (female)" },
    { "palabra": "profesor", "traduccion_ingles": "teacher (male)" },
    { "palabra": "profesora", "traduccion_ingles": "teacher (female)" },
    { "palabra": "estudiante", "traduccion_ingles": "student" },
    { "palabra": "médico", "traduccion_ingles": "doctor (male)" },
    { "palabra": "médica", "traduccion_ingles": "doctor (female)" },
    { "palabra": "enfermero", "traduccion_ingles": "nurse (male)" },
    { "palabra": "enfermera", "traduccion_ingles": "nurse (female)" },
    { "palabra": "cocinero", "traduccion_ingles": "cook / chef (male)" },
    { "palabra": "cocinera", "traduccion_ingles": "cook / chef (female)" },
    { "palabra": "policía", "traduccion_ingles": "police officer" },
    { "palabra": "camarero", "traduccion_ingles": "waiter" },
    { "palabra": "camarera", "traduccion_ingles": "waitress" },
    { "palabra": "secretario", "traduccion_ingles": "secretary (male)" },
    { "palabra": "secretaria", "traduccion_ingles": "secretary (female)" },
    { "palabra": "taxista", "traduccion_ingles": "taxi driver" },
    { "palabra": "cero", "traduccion_ingles": "zero" },
    { "palabra": "uno", "traduccion_ingles": "one" },
    { "palabra": "dos", "traduccion_ingles": "two" },
    { "palabra": "tres", "traduccion_ingles": "three" },
    { "palabra": "cuatro", "traduccion_ingles": "four" },
    { "palabra": "cinco", "traduccion_ingles": "five" },
    { "palabra": "seis", "traduccion_ingles": "six" },
    { "palabra": "siete", "traduccion_ingles": "seven" },
    { "palabra": "ocho", "traduccion_ingles": "eight" },
    { "palabra": "nueve", "traduccion_ingles": "nine" },
    { "palabra": "diez", "traduccion_ingles": "ten" },
    { "palabra": "once", "traduccion_ingles": "eleven" },
    { "palabra": "doce", "traduccion_ingles": "twelve" },
    { "palabra": "trece", "traduccion_ingles": "thirteen" },
    { "palabra": "catorce", "traduccion_ingles": "fourteen" },
    { "palabra": "quince", "traduccion_ingles": "fifteen" },
    { "palabra": "veinte", "traduccion_ingles": "twenty" },
    { "palabra": "treinta", "traduccion_ingles": "thirty" },
    { "palabra": "cuarenta", "traduccion_ingles": "forty" },
    { "palabra": "cincuenta", "traduccion_ingles": "fifty" },
    { "palabra": "sesenta", "traduccion_ingles": "sixty" },
    { "palabra": "setenta", "traduccion_ingles": "seventy" },
    { "palabra": "ochenta", "traduccion_ingles": "eighty" },
    { "palabra": "noventa", "traduccion_ingles": "ninety" },
    { "palabra": "cien", "traduccion_ingles": "one hundred" },
    { "palabra": "lunes", "traduccion_ingles": "Monday" },
    { "palabra": "martes", "traduccion_ingles": "Tuesday" },
    { "palabra": "miércoles", "traduccion_ingles": "Wednesday" },
    { "palabra": "jueves", "traduccion_ingles": "Thursday" },
    { "palabra": "viernes", "traduccion_ingles": "Friday" },
    { "palabra": "sábado", "traduccion_ingles": "Saturday" },
    { "palabra": "domingo", "traduccion_ingles": "Sunday" },
    { "palabra": "enero", "traduccion_ingles": "January" },
    { "palabra": "febrero", "traduccion_ingles": "February" },
    { "palabra": "marzo", "traduccion_ingles": "March" },
    { "palabra": "abril", "traduccion_ingles": "April" },
    { "palabra": "mayo", "traduccion_ingles": "May" },
    { "palabra": "junio", "traduccion_ingles": "June" },
    { "palabra": "julio", "traduccion_ingles": "July" },
    { "palabra": "agosto", "traduccion_ingles": "August" },
    { "palabra": "septiembre", "traduccion_ingles": "September" },
    { "palabra": "octubre", "traduccion_ingles": "October" },
    { "palabra": "noviembre", "traduccion_ingles": "November" },
    { "palabra": "diciembre", "traduccion_ingles": "December" },
    { "palabra": "primavera", "traduccion_ingles": "spring" },
    { "palabra": "verano", "traduccion_ingles": "summer" },
    { "palabra": "otoño", "traduccion_ingles": "autumn / fall" },
    { "palabra": "invierno", "traduccion_ingles": "winter" },
    { "palabra": "tiempo", "traduccion_ingles": "weather" },
    { "palabra": "sol", "traduccion_ingles": "sun" },
    { "palabra": "calor", "traduccion_ingles": "heat" },
    { "palabra": "frío", "traduccion_ingles": "cold" },
    { "palabra": "viento", "traduccion_ingles": "wind" },
    { "palabra": "lluvia", "traduccion_ingles": "rain" },
    { "palabra": "nieve", "traduccion_ingles": "snow" },
    { "palabra": "nube", "traduccion_ingles": "cloud" },
    { "palabra": "nublado", "traduccion_ingles": "cloudy" },
    { "palabra": "tormenta", "traduccion_ingles": "storm" },
    { "palabra": "casa", "traduccion_ingles": "house" },
    { "palabra": "piso", "traduccion_ingles": "flat / apartment" },
    { "palabra": "habitación", "traduccion_ingles": "room" },
    { "palabra": "dormitorio", "traduccion_ingles": "bedroom" },
    { "palabra": "salón", "traduccion_ingles": "living room" },
    { "palabra": "comedor", "traduccion_ingles": "dining room" },
    { "palabra": "cocina", "traduccion_ingles": "kitchen" },
    { "palabra": "baño", "traduccion_ingles": "bathroom" },
    { "palabra": "jardín", "traduccion_ingles": "garden" },
    { "palabra": "pared", "traduccion_ingles": "wall" },
    { "palabra": "suelo", "traduccion_ingles": "floor" },
    { "palabra": "mesa", "traduccion_ingles": "table" },
    { "palabra": "silla", "traduccion_ingles": "chair" },
    { "palabra": "cama", "traduccion_ingles": "bed" },
    { "palabra": "sofá", "traduccion_ingles": "sofa / couch" },
    { "palabra": "armario", "traduccion_ingles": "wardrobe / closet" },
    { "palabra": "estantería", "traduccion_ingles": "shelf / bookcase" },
    { "palabra": "lámpara", "traduccion_ingles": "lamp" },
    { "palabra": "espejo", "traduccion_ingles": "mirror" },
    { "palabra": "televisión", "traduccion_ingles": "television" },
    { "palabra": "nevera", "traduccion_ingles": "fridge" },
    { "palabra": "lavadora", "traduccion_ingles": "washing machine" },
    { "palabra": "móvil", "traduccion_ingles": "mobile phone" },
    { "palabra": "llave", "traduccion_ingles": "key" },
    { "palabra": "reloj", "traduccion_ingles": "watch / clock" },
    { "palabra": "bolso", "traduccion_ingles": "bag / handbag" },
    { "palabra": "cartera", "traduccion_ingles": "wallet" },
    { "palabra": "paraguas", "traduccion_ingles": "umbrella" },
    { "palabra": "dinero", "traduccion_ingles": "money" },
    { "palabra": "tarjeta", "traduccion_ingles": "card (credit/debit)" },
    { "palabra": "libro", "traduccion_ingles": "book" },
    { "palabra": "cuaderno", "traduccion_ingles": "notebook" },
    { "palabra": "papel", "traduccion_ingles": "paper" },
    { "palabra": "bolígrafo", "traduccion_ingles": "pen" },
    { "palabra": "lápiz", "traduccion_ingles": "pencil" },
    { "palabra": "ordenador", "traduccion_ingles": "computer" },
    { "palabra": "mochila", "traduccion_ingles": "backpack" },
    { "palabra": "ciudad", "traduccion_ingles": "city" },
    { "palabra": "pueblo", "traduccion_ingles": "town / village" },
    { "palabra": "barrio", "traduccion_ingles": "neighborhood" },
    { "palabra": "calle", "traduccion_ingles": "street" },
    { "palabra": "plaza", "traduccion_ingles": "square" },
    { "palabra": "parque", "traduccion_ingles": "park" },
    { "palabra": "tienda", "traduccion_ingles": "shop / store" },
    { "palabra": "supermercado", "traduccion_ingles": "supermarket" },
    { "palabra": "mercado", "traduccion_ingles": "market" },
    { "palabra": "escuela", "traduccion_ingles": "school" },
    { "palabra": "hospital", "traduccion_ingles": "hospital" },
    { "palabra": "farmacia", "traduccion_ingles": "pharmacy" },
    { "palabra": "banco", "traduccion_ingles": "bank" },
    { "palabra": "restaurante", "traduccion_ingles": "restaurant" },
    { "palabra": "bar", "traduccion_ingles": "bar / cafe" },
    { "palabra": "cine", "traduccion_ingles": "cinema / movie theater" },
    { "palabra": "hotel", "traduccion_ingles": "hotel" },
    { "palabra": "museo", "traduccion_ingles": "museum" },
    { "palabra": "aeropuerto", "traduccion_ingles": "airport" },
    { "palabra": "estación", "traduccion_ingles": "station (train/bus)" },
    { "palabra": "coche", "traduccion_ingles": "car" },
    { "palabra": "autobús", "traduccion_ingles": "bus" },
    { "palabra": "metro", "traduccion_ingles": "metro / subway" },
    { "palabra": "tren", "traduccion_ingles": "train" },
    { "palabra": "bicicleta", "traduccion_ingles": "bicycle" },
    { "palabra": "moto", "traduccion_ingles": "motorcycle" },
    { "palabra": "avión", "traduccion_ingles": "plane" },
    { "palabra": "taxi", "traduccion_ingles": "taxi" },
    { "palabra": "barco", "traduccion_ingles": "boat / ship" },
    { "palabra": "alto", "traduccion_ingles": "tall (male)" },
    { "palabra": "alta", "traduccion_ingles": "tall (female)" },
    { "palabra": "bajo", "traduccion_ingles": "short (height - male)" },
    { "palabra": "baja", "traduccion_ingles": "short (height - female)" },
    { "palabra": "gordo", "traduccion_ingles": "fat (male)" },
    { "palabra": "gorda", "traduccion_ingles": "fat (female)" },
    { "palabra": "delgado", "traduccion_ingles": "thin (male)" },
    { "palabra": "delgada", "traduccion_ingles": "thin (female)" },
    { "palabra": "guapo", "traduccion_ingles": "handsome" },
    { "palabra": "guapa", "traduccion_ingles": "beautiful / pretty" },
    { "palabra": "feo", "traduccion_ingles": "ugly (male)" },
    { "palabra": "joven", "traduccion_ingles": "young" },
    { "palabra": "mayor", "traduccion_ingles": "old / elderly" },
    { "palabra": "pelo", "traduccion_ingles": "hair" },
    { "palabra": "ojos", "traduccion_ingles": "eyes" },
    { "palabra": "rubio", "traduccion_ingles": "blonde (male)" },
    { "palabra": "morena", "traduccion_ingles": "brunette / dark-haired (female)" },
    { "palabra": "largo", "traduccion_ingles": "long" },
    { "palabra": "corto", "traduccion_ingles": "short (length)" },
    { "palabra": "barba", "traduccion_ingles": "beard" },
    { "palabra": "simpático", "traduccion_ingles": "nice / friendly (male)" },
    { "palabra": "antipático", "traduccion_ingles": "unfriendly / unpleasant" },
    { "palabra": "bueno", "traduccion_ingles": "good / kind" },
    { "palabra": "malo", "traduccion_ingles": "bad / mean" },
    { "palabra": "amable", "traduccion_ingles": "kind / polite" },
    { "palabra": "divertido", "traduccion_ingles": "fun / funny" },
    { "palabra": "aburrido", "traduccion_ingles": "boring" },
    { "palabra": "inteligente", "traduccion_ingles": "intelligent" },
    { "palabra": "trabajador", "traduccion_ingles": "hard-working (male)" },
    { "palabra": "vago", "traduccion_ingles": "lazy" },
    { "palabra": "alegre", "traduccion_ingles": "cheerful / happy" },
    { "palabra": "serio", "traduccion_ingles": "serious" },
    { "palabra": "tímido", "traduccion_ingles": "shy" },
    { "palabra": "feliz", "traduccion_ingles": "happy" },
    { "palabra": "triste", "traduccion_ingles": "sad" },
    { "palabra": "rojo", "traduccion_ingles": "red" },
    { "palabra": "azul", "traduccion_ingles": "blue" },
    { "palabra": "verde", "traduccion_ingles": "green" },
    { "palabra": "amarillo", "traduccion_ingles": "yellow" },
    { "palabra": "blanco", "traduccion_ingles": "white" },
    { "palabra": "negro", "traduccion_ingles": "black" },
    { "palabra": "marrón", "traduccion_ingles": "brown" },
    { "palabra": "gris", "traduccion_ingles": "grey" },
    { "palabra": "naranja", "traduccion_ingles": "orange" },
    { "palabra": "rosa", "traduccion_ingles": "pink" },
    { "palabra": "violeta", "traduccion_ingles": "violet / purple" },
    { "palabra": "camiseta", "traduccion_ingles": "t-shirt" },
    { "palabra": "camisa", "traduccion_ingles": "shirt" },
    { "palabra": "pantalón", "traduccion_ingles": "trousers / pants" },
    { "palabra": "vaqueros", "traduccion_ingles": "jeans" },
    { "palabra": "falda", "traduccion_ingles": "skirt" },
    { "palabra": "vestido", "traduccion_ingles": "dress" },
    { "palabra": "zapatos", "traduccion_ingles": "shoes" },
    { "palabra": "zapatillas", "traduccion_ingles": "sneakers / trainers" },
    { "palabra": "abrigo", "traduccion_ingles": "coat" },
    { "palabra": "chaqueta", "traduccion_ingles": "jacket" },
    { "palabra": "jersey", "traduccion_ingles": "jumper / sweater" },
    { "palabra": "calcetines", "traduccion_ingles": "socks" },
    { "palabra": "bufanda", "traduccion_ingles": "scarf" },
    { "palabra": "gorro", "traduccion_ingles": "hat (winter/beanie)" },
    { "palabra": "guantes", "traduccion_ingles": "gloves" },
    { "palabra": "agua", "traduccion_ingles": "water" },
    { "palabra": "café", "traduccion_ingles": "coffee" },
    { "palabra": "leche", "traduccion_ingles": "milk" },
    { "palabra": "té", "traduccion_ingles": "tea" },
    { "palabra": "zumo", "traduccion_ingles": "juice" },
    { "palabra": "vino", "traduccion_ingles": "wine" },
    { "palabra": "cerveza", "traduccion_ingles": "beer" },
    { "palabra": "pan", "traduccion_ingles": "bread" },
    { "palabra": "huevo", "traduccion_ingles": "egg" },
    { "palabra": "carne", "traduccion_ingles": "meat" },
    { "palabra": "pollo", "traduccion_ingles": "chicken" },
    { "palabra": "pescado", "traduccion_ingles": "fish (food)" },
    { "palabra": "fruta", "traduccion_ingles": "fruit" },
    { "palabra": "manzana", "traduccion_ingles": "apple" },
    { "palabra": "plátano", "traduccion_ingles": "banana" },
    { "palabra": "limón", "traduccion_ingles": "lemon" },
    { "palabra": "verdura", "traduccion_ingles": "vegetables" },
    { "palabra": "ensalada", "traduccion_ingles": "salad" },
    { "palabra": "tomate", "traduccion_ingles": "tomato" },
    { "palabra": "patata", "traduccion_ingles": "potato" },
    { "palabra": "arroz", "traduccion_ingles": "rice" },
    { "palabra": "pasta", "traduccion_ingles": "pasta" },
    { "palabra": "queso", "traduccion_ingles": "cheese" },
    { "palabra": "azúcar", "traduccion_ingles": "sugar" },
    { "palabra": "sal", "traduccion_ingles": "salt" },
    { "palabra": "aceite", "traduccion_ingles": "oil" },
    { "palabra": "chocolate", "traduccion_ingles": "chocolate" },
    { "palabra": "menú", "traduccion_ingles": "menu (set menu)" },
    { "palabra": "carta", "traduccion_ingles": "menu (a la carte)" },
    { "palabra": "cuenta", "traduccion_ingles": "bill / check" },
    { "palabra": "desayuno", "traduccion_ingles": "breakfast" },
    { "palabra": "almuerzo", "traduccion_ingles": "lunch" },
    { "palabra": "cena", "traduccion_ingles": "dinner" },
    { "palabra": "postre", "traduccion_ingles": "dessert" },
    { "palabra": "plato", "traduccion_ingles": "plate / dish" },
    { "palabra": "vaso", "traduccion_ingles": "glass" },
    { "palabra": "taza", "traduccion_ingles": "cup / mug" },
    { "palabra": "tenedor", "traduccion_ingles": "fork" },
    { "palabra": "cuchillo", "traduccion_ingles": "knife" },
    { "palabra": "cuchara", "traduccion_ingles": "spoon" },
    { "palabra": "servilleta", "traduccion_ingles": "napkin" },
    { "palabra": "rico", "traduccion_ingles": "tasty / good" },
    { "palabra": "delicioso", "traduccion_ingles": "delicious" },
    { "palabra": "ser", "traduccion_ingles": "to be (permanent)" },
    { "palabra": "estar", "traduccion_ingles": "to be (temporary/location)" },
    { "palabra": "tener", "traduccion_ingles": "to have" },
    { "palabra": "haber", "traduccion_ingles": "there is / there are" },
    { "palabra": "querer", "traduccion_ingles": "to want" },
    { "palabra": "poder", "traduccion_ingles": "to be able to / can" },
    { "palabra": "saber", "traduccion_ingles": "to know (facts/skills)" },
    { "palabra": "llamarse", "traduccion_ingles": "to be called" },
    { "palabra": "hablar", "traduccion_ingles": "to speak" },
    { "palabra": "comer", "traduccion_ingles": "to eat" },
    { "palabra": "beber", "traduccion_ingles": "to drink" },
    { "palabra": "vivir", "traduccion_ingles": "to live" },
    { "palabra": "ir", "traduccion_ingles": "to go" },
    { "palabra": "venir", "traduccion_ingles": "to come" },
    { "palabra": "hacer", "traduccion_ingles": "to do / to make" },
    { "palabra": "dormir", "traduccion_ingles": "to sleep" },
    { "palabra": "levantarse", "traduccion_ingles": "to get up" },
    { "palabra": "ducharse", "traduccion_ingles": "to take a shower" },
    { "palabra": "trabajar", "traduccion_ingles": "to work" },
    { "palabra": "gustar", "traduccion_ingles": "to like" },
    { "palabra": "leer", "traduccion_ingles": "to read" },
    { "palabra": "escribir", "traduccion_ingles": "to write" },
    { "palabra": "escuchar", "traduccion_ingles": "to listen" },
    { "palabra": "mirar", "traduccion_ingles": "to look / to watch" },
    { "palabra": "ver", "traduccion_ingles": "to see / to watch" },
    { "palabra": "estudiar", "traduccion_ingles": "to study" },
    { "palabra": "aprender", "traduccion_ingles": "to learn" },
    { "palabra": "jugar", "traduccion_ingles": "to play" },
    { "palabra": "comprar", "traduccion_ingles": "to buy" },
    { "palabra": "viajar", "traduccion_ingles": "to travel" },
    { "palabra": "salir", "traduccion_ingles": "to go out / leave" },
    { "palabra": "llegar", "traduccion_ingles": "to arrive" },
    { "palabra": "entrar", "traduccion_ingles": "to enter" },
    { "palabra": "bien", "traduccion_ingles": "well / good" },
    { "palabra": "mal", "traduccion_ingles": "bad / poorly" },
    { "palabra": "regular", "traduccion_ingles": "so-so / okay" },
    { "palabra": "contento", "traduccion_ingles": "happy / content" },
    { "palabra": "cansado", "traduccion_ingles": "tired" },
    { "palabra": "enfadado", "traduccion_ingles": "angry" },
    { "palabra": "nervioso", "traduccion_ingles": "nervous" },
    { "palabra": "tranquilo", "traduccion_ingles": "calm / relaxed" },
    { "palabra": "ocupado", "traduccion_ingles": "busy" },
    { "palabra": "enfermo", "traduccion_ingles": "sick / ill" },
    { "palabra": "hambre", "traduccion_ingles": "hunger" },
    { "palabra": "sed", "traduccion_ingles": "thirst" },
    { "palabra": "sueño", "traduccion_ingles": "sleepiness" },
    { "palabra": "miedo", "traduccion_ingles": "fear" },
    { "palabra": "prisa", "traduccion_ingles": "hurry" },
    { "palabra": "aquí", "traduccion_ingles": "here" },
    { "palabra": "allí", "traduccion_ingles": "there" },
    { "palabra": "cerca", "traduccion_ingles": "near / close" },
    { "palabra": "lejos", "traduccion_ingles": "far" },
    { "palabra": "delante", "traduccion_ingles": "in front" },
    { "palabra": "detrás", "traduccion_ingles": "behind" },
    { "palabra": "enfrente", "traduccion_ingles": "opposite / facing" },
    { "palabra": "encima", "traduccion_ingles": "on top of" },
    { "palabra": "debajo", "traduccion_ingles": "under / underneath" },
    { "palabra": "dentro", "traduccion_ingles": "inside" },
    { "palabra": "fuera", "traduccion_ingles": "outside" },
    { "palabra": "entre", "traduccion_ingles": "between" },
    { "palabra": "en", "traduccion_ingles": "in / on / at" }
];

// --- UTILIDADES ---

function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getCharFrequency(str) {
    const freq = {};
    for (const char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}

// Verifica que la candidata use SOLO letras de la base y en cantidades <= a las de la base
function isStrictSubset(candidateStr, baseFreq) {
    const candFreq = getCharFrequency(candidateStr);
    for (const char in candFreq) {
        // 1. ¿Existe la letra en la base?
        if (!baseFreq[char]) return false;
        // 2. ¿La cantidad en candidata supera a la base?
        if (candFreq[char] > baseFreq[char]) return false;
    }
    return true;
}

// --- LÓGICA DEL JUEGO (ANAGRAMA ESTRICTO) ---

function generateCrosswordLogic() {
    const singleWords = vocabulario.filter(v => !v.palabra.includes(" ") && !v.palabra.includes("?"));
    const longWords = singleWords.filter(v => v.palabra.length >= 7); // Base larga para tener "inventario" suficiente
    
    if (longWords.length === 0) return null;

    const MAX_ATTEMPTS = 300; // Más intentos necesarios por la restricción estricta
    let attempt = 0;

    while (attempt < MAX_ATTEMPTS) {
        attempt++;
        
        // 1. Seleccionar palabra base
        const baseWordObj = getRandomElement(longWords);
        const baseWord = normalize(baseWordObj.palabra);
        
        // Crear mapa de frecuencia de la base (Inventario de letras disponibles)
        const baseFreq = getCharFrequency(baseWord);

        // 2. Filtrar pool de palabras VÁLIDAS (Anagrama parcial estricto)
        const validPool = singleWords.filter(v => {
            const normV = normalize(v.palabra);
            
            // Condición: Más corta y subset estricto (letras y cantidades)
            if (normV.length >= baseWord.length) return false;
            if (normV.length < 2) return false; 

            return isStrictSubset(normV, baseFreq);
        });

        // Si el pool es muy pequeño, esta palabra base no sirve para el juego
        if (validPool.length < 3) continue; 

        // --- Inicio Algoritmo de Colocación ---
        
        let placedWords = [];
        placedWords.push({
            wordObj: baseWordObj,
            x: 0,
            y: 0,
            dir: 'H',
            normalized: baseWord
        });

        let usedWords = [baseWordObj.palabra];
        let intersectCount = 0;
        let retriesInBase = 0;

        // Intentamos colocar hasta 4 palabras verticales
        while (intersectCount < 4 && retriesInBase < 50) {
            retriesInBase++;

            // Elegir candidata del pool validado
            const candidateObj = getRandomElement(validPool);
            if (usedWords.includes(candidateObj.palabra)) continue;

            const candidateNorm = normalize(candidateObj.palabra);
            
            // Buscar punto de cruce
            let placed = false;
            const baseIndices = Array.from({length: baseWord.length}, (_, i) => i).sort(() => Math.random() - 0.5);

            for (let i of baseIndices) {
                const charBase = baseWord[i];
                
                if (candidateNorm.includes(charBase)) {
                    const charIndexCand = candidateNorm.indexOf(charBase);
                    
                    // Coordenadas para cruzar verticalmente
                    const proposedWord = {
                        wordObj: candidateObj,
                        x: i,
                        y: -charIndexCand,
                        dir: 'V',
                        normalized: candidateNorm
                    };

                    // Verificación de colisiones
                    const collision = placedWords.some(pw => {
                        if (pw.dir === 'H') return false; 
                        return Math.abs(pw.x - proposedWord.x) < 2; 
                    });

                    if (!collision) {
                        placedWords.push(proposedWord);
                        usedWords.push(candidateObj.palabra);
                        intersectCount++;
                        placed = true;
                        break; 
                    }
                }
            }
        }

        if (intersectCount >= 2) {
            return { words: placedWords, baseWord: baseWordObj.palabra.toUpperCase() };
        }
    }
    
    console.log("Falló la generación, reintentando...");
    return null;
}

let currentWords = [];
let gridOffsetX = 0;
let gridOffsetY = 0;

function initGame() {
    const result = generateCrosswordLogic();
    
    if (!result) {
        // Reintento automático si no encuentra combinación válida
        setTimeout(initGame, 50);
        return;
    }

    currentWords = result.words;

    renderGrid(currentWords);
    renderClues(currentWords);
}

function renderGrid(words) {
    const gridContainer = document.getElementById('crossword-grid');
    gridContainer.innerHTML = '';

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    words.forEach(w => {
        const len = w.normalized.length;
        const xEnd = w.dir === 'H' ? w.x + len - 1 : w.x;
        const yEnd = w.dir === 'V' ? w.y + len - 1 : w.y;

        minX = Math.min(minX, w.x);
        maxX = Math.max(maxX, xEnd);
        minY = Math.min(minY, w.y);
        maxY = Math.max(maxY, yEnd);
    });

    gridOffsetX = minX;
    gridOffsetY = minY;

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    gridContainer.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
    gridContainer.style.gridTemplateRows = `repeat(${height}, var(--cell-size))`;

    const cellMap = new Map();

    words.forEach((w, index) => {
        const len = w.normalized.length;
        for (let i = 0; i < len; i++) {
            const posX = (w.dir === 'H' ? w.x + i : w.x) - minX;
            const posY = (w.dir === 'V' ? w.y + i : w.y) - minY;
            const char = w.normalized[i];
            const key = `${posX},${posY}`;

            let cellDiv = cellMap.get(key);
            
            if (!cellDiv) {
                cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.gridColumnStart = posX + 1;
                cellDiv.style.gridRowStart = posY + 1;

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'cell-input';
                input.dataset.correct = char;
                input.dataset.x = posX;
                input.dataset.y = posY;

                input.addEventListener('input', function() {
                    // Lógica visual opcional
                });

                input.addEventListener('keydown', function(event) {
                    const { key } = event;
                    const currentX = parseInt(event.target.dataset.x, 10);
                    const currentY = parseInt(event.target.dataset.y, 10);

                    const deltas = {
                        ArrowUp: { dx: 0, dy: -1 },
                        ArrowDown: { dx: 0, dy: 1 },
                        ArrowLeft: { dx: -1, dy: 0 },
                        ArrowRight: { dx: 1, dy: 0 }
                    };

                    if (!deltas[key]) return;

                    event.preventDefault();

                    const { dx, dy } = deltas[key];
                    const targetX = currentX + dx;
                    const targetY = currentY + dy;

                    const targetInput = document.querySelector(
                        `.cell-input[data-x="${targetX}"][data-y="${targetY}"]`
                    );

                    if (targetInput) {
                        targetInput.focus();
                    }
                });

                cellDiv.appendChild(input);
                gridContainer.appendChild(cellDiv);
                cellMap.set(key, cellDiv);
            }

            if (i === 0) {
                const numSpan = document.createElement('span');
                numSpan.className = 'cell-number';
                numSpan.innerText = index + 1;
                if(!cellDiv.querySelector('.cell-number')) {
                    cellDiv.appendChild(numSpan);
                }
            }
        }
    });
}

function solveBaseWord() {
    if (!currentWords.length) return;

    const baseWord = currentWords.find(w => w.dir === 'H');
    if (!baseWord) return;

    for (let i = 0; i < baseWord.normalized.length; i++) {
        const posX = (baseWord.x + i) - gridOffsetX;
        const posY = baseWord.y - gridOffsetY;

        const input = document.querySelector(
            `.cell-input[data-x="${posX}"][data-y="${posY}"]`
        );

        if (input) {
            input.value = baseWord.normalized[i];
            input.parentElement.classList.remove('incorrect', 'correct');
        }
    }
}

function renderClues(words) {
    const hContainer = document.getElementById('clues-horizontal');
    const vContainer = document.getElementById('clues-vertical');
    hContainer.innerHTML = '';
    vContainer.innerHTML = '';

    words.forEach((w, index) => {
        const div = document.createElement('div');
        div.className = 'clue-item';
        div.innerHTML = `<span class="clue-badge">${index + 1}</span> ${w.wordObj.traduccion_ingles}`;
        
        if (w.dir === 'H') {
            hContainer.appendChild(div);
        } else {
            vContainer.appendChild(div);
        }
    });
}

function checkAnswers() {
    const inputs = document.querySelectorAll('.cell-input');
    inputs.forEach(input => {
        const userVal = normalize(input.value);
        const correctVal = input.dataset.correct;
        const parent = input.parentElement;

        parent.classList.remove('correct', 'incorrect');

        if (userVal === '') {
            // vacío
        } else if (userVal === correctVal) {
            parent.classList.add('correct');
        } else {
            parent.classList.add('incorrect');
        }
    });
}

window.onload = initGame;
