document.addEventListener('DOMContentLoaded', function() {
 const locationButton = document.getElementById('locationButton');
 const locationText = document.getElementById('locationText');

 function getLocation() {
     if (navigator.geolocation) {
         locationText.textContent = 'Konum alınıyor...';
         navigator.geolocation.getCurrentPosition(showPosition, showError);
     } else {
         locationText.textContent = 'Konum servisi desteklenmiyor';
     }
 }

 function showPosition(position) {
     const latitude = position.coords.latitude;
     const longitude = position.coords.longitude;
     

     fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
         .then(response => response.json())
         .then(data => {
             const city = data.address.city || data.address.town || data.address.village || 'Bilinmeyen Şehir';
             locationText.textContent = city;
         })
         .catch(error => {
             locationText.textContent = 'Konum bulunamadı';
         });
 }

 function showError(error) {
     switch(error.code) {
         case error.PERMISSION_DENIED:
             locationText.textContent = 'Konum izni reddedildi';
             break;
         case error.POSITION_UNAVAILABLE:
             locationText.textContent = 'Konum bilgisi mevcut değil';
             break;
         case error.TIMEOUT:
             locationText.textContent = 'İstek zaman aşımına uğradı';
             break;
         case error.UNKNOWN_ERROR:
             locationText.textContent = 'Bilinmeyen bir hata oluştu';
             break;
     }
 }


 locationButton.addEventListener('click', function(e) {
     e.preventDefault();
     getLocation();
 });
});