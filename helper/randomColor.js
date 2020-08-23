const Colors = ['blue', 'green', 'red', 'a', 'b', 'c', 'd', 'e'];

const randomColor = () => {
    return Colors[Math.floor(Math.random() * Colors.length)]
}


module.exports = randomColor;