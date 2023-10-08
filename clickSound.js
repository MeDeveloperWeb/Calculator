const audio = new Audio('media/click.mp3');

// document.querySelector(".keys-container").addEventListener('click', (e) => {
//     if (e.target.tagName === "BUTTON") audio.play();
// });

document.querySelectorAll("button").forEach(btn => btn.onclick = () => audio.play());