// src/services/geolocationService.js

class GeolocationService {
  constructor() {
    this.currentPosition = null;
    this.locationName = null;
  }

  // Get user's current position
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(this.currentPosition);
        },
        (error) => {
          let errorMessage = 'Unknown error occurred';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Reverse geocoding - convert coordinates to location name
  async getLocationName(latitude, longitude) {
    try {
      // In a real application, you would use a geocoding service like:
      // - Google Maps Geocoding API
      // - OpenStreetMap Nominatim
      // - Mapbox Geocoding API
      
      // For demo purposes, we'll simulate this with mock data
      const mockLocations = [
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, radius: 100 },
        { name: 'Delhi', lat: 28.7041, lng: 77.1025, radius: 100 },
        { name: 'Bangalore', lat: 12.9716, lng: 77.5946, radius: 100 },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, radius: 100 },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639, radius: 100 },
        { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, radius: 100 },
        { name: 'Pune', lat: 18.5204, lng: 73.8567, radius: 100 },
        { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, radius: 100 }
      ];

      // Find the closest city
      let closestCity = null;
      let minDistance = Infinity;

      for (const city of mockLocations) {
        const distance = this.calculateDistance(latitude, longitude, city.lat, city.lng);
        if (distance < city.radius && distance < minDistance) {
          minDistance = distance;
          closestCity = city;
        }
      }

      if (closestCity) {
        this.locationName = closestCity.name;
        return closestCity.name;
      } else {
        // If not in any major city, return a generic location
        this.locationName = 'Your Area';
        return 'Your Area';
      }
    } catch (error) {
      console.error('Error getting location name:', error);
      throw new Error('Unable to determine location name');
    }
  }

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get full location data
  async getFullLocationData() {
    try {
      const position = await this.getCurrentPosition();
      const locationName = await this.getLocationName(position.latitude, position.longitude);
      
      return {
        coordinates: position,
        name: locationName,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  // Watch position changes
  watchPosition(callback, errorCallback) {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported'));
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        callback(this.currentPosition);
      },
      (error) => {
        errorCallback(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    );
  }

  // Clear watch
  clearWatch(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
}

// Create a singleton instance
const geolocationService = new GeolocationService();

export default geolocationService;
