import { SubsonicCredentials, SubsonicResponse } from '../types';
import CryptoJS from 'crypto-js';

class SubsonicApi {
  private credentials: SubsonicCredentials | null = null;
  private salt = '';
  
  constructor() {
    this.salt = Math.random().toString(36).substring(2, 15);
  }

  setCredentials(credentials: SubsonicCredentials) {
    this.credentials = credentials;
  }

  getCredentials(): SubsonicCredentials | null {
    return this.credentials;
  }

  clearCredentials() {
    this.credentials = null;
  }

  isAuthenticated(): boolean {
    return this.credentials !== null;
  }

  private createAuthParams(): URLSearchParams {
    if (!this.credentials) {
      throw new Error('No credentials set');
    }

    const { username, password } = this.credentials;
    const params = new URLSearchParams();
    
    // Add standard parameters
    params.append('u', username);
    params.append('v', '1.16.1');
    params.append('c', 'subsonicReact');
    params.append('f', 'json');
    
    // Use token-based authentication
    params.append('t', this.getToken(password));
    params.append('s', this.salt);
    
    return params;
  }

  private getToken(password: string): string {
    // Create a token based on password and salt (hex encoded MD5 hash)
    const token = password + this.salt;
    return this.md5(token);
  }

  // MD5 implementation using crypto-js
  private md5(input: string): string {
    const hash = CryptoJS.MD5(input);
    return hash.toString(CryptoJS.enc.Hex);
  }

  private getBaseUrl(): string {
    if (!this.credentials) {
      throw new Error('No credentials set');
    }
    
    let url = this.credentials.serverUrl;
    
    // Ensure URL ends with /rest/
    if (!url.endsWith('/')) {
      url += '/';
    }
    if (!url.endsWith('rest/')) {
      url += 'rest/';
    }
    
    return url;
  }

  private async fetchSubsonic<T>(endpoint: string, additionalParams: Record<string, string> = {}): Promise<T> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }
    
    const params = this.createAuthParams();
    
    // Add any additional parameters
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    const url = `${this.getBaseUrl()}${endpoint}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json() as SubsonicResponse<T>;
      
      if (data['subsonic-response'].status !== 'ok') {
        throw new Error(data['subsonic-response'].error?.message || 'Unknown error');
      }
      
      return data['subsonic-response'] as unknown as T;
    } catch (error) {
      console.error('Subsonic API error:', error);
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.fetchSubsonic('ping');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getArtists() {
    return this.fetchSubsonic('getArtists');
  }

  async getArtist(id: string) {
    return this.fetchSubsonic('getArtist', { id });
  }

  async getAlbum(id: string) {
    return this.fetchSubsonic('getAlbum', { id });
  }

  async getAlbumList(type: string = 'newest', size: number = 50) {
    return this.fetchSubsonic('getAlbumList', { type, size: size.toString() });
  }

  async search(query: string, artistCount: number = 20, albumCount: number = 20, songCount: number = 20) {
    return this.fetchSubsonic('search3', {
      query,
      artistCount: artistCount.toString(),
      albumCount: albumCount.toString(),
      songCount: songCount.toString()
    });
  }

  getStreamUrl(id: string): string {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }
    
    const params = this.createAuthParams();
    params.append('id', id);
    
    return `${this.getBaseUrl()}stream?${params.toString()}`;
  }

  getCoverArtUrl(id: string, size: number = 300): string {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }
    
    const params = this.createAuthParams();
    params.append('id', id);
    params.append('size', size.toString());
    
    return `${this.getBaseUrl()}getCoverArt?${params.toString()}`;
  }
}

// Create a singleton instance
const subsonicApi = new SubsonicApi();
export default subsonicApi;