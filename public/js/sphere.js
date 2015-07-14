$(function () {
    var photosphere = THREE.Photosphere(document.getElementById('sphere'), '/img/gaustatoppen.jpg', {
    });
    window.onresize = photosphere.resize;
});