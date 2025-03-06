document.addEventListener('DOMContentLoaded', function() {
    const opinions = document.querySelectorAll('.opinion');
    let currentIndex = 0;

    
    opinions[currentIndex].classList.add('active');

    setInterval(() => {
        
        opinions[currentIndex].classList.remove('active');

        
        currentIndex = (currentIndex + 1) % opinions.length;

        opinions[currentIndex].classList.add('active');
    }, 5000); 
});