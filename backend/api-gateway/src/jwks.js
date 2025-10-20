const jose = require('jose');
const crypto = require('crypto');

class JWKSManager {
  constructor() {
    this.keys = new Map();
    this.currentKid = null;
    this.rotationInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async initialize() {
    await this.rotateKey();
    
    setInterval(() => {
      this.rotateKey();
    }, this.rotationInterval);
  }

  async rotateKey() {
    const kid = crypto.randomUUID();
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256');
    
    this.keys.set(kid, { publicKey, privateKey });
    this.currentKid = kid;
    
    if (this.keys.size > 3) {
      const oldestKid = Array.from(this.keys.keys())[0];
      this.keys.delete(oldestKid);
    }
    
    console.log(`🔑 JWT key rotated. New kid: ${kid}`);
  }

  async sign(payload, options = {}) {
    if (!this.currentKid) {
      throw new Error('JWKS not initialized');
    }

    const { privateKey } = this.keys.get(this.currentKid);
    
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256', kid: this.currentKid })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn || '24h')
      .setIssuer('friendapp-gateway')
      .sign(privateKey);

    return jwt;
  }

  async verify(token) {
    const { kid } = jose.decodeProtectedHeader(token);
    
    if (!kid || !this.keys.has(kid)) {
      throw new Error('Invalid or expired key');
    }

    const { publicKey } = this.keys.get(kid);
    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: 'friendapp-gateway'
    });

    return payload;
  }

  getJWKS() {
    const keys = Array.from(this.keys.entries()).map(([kid, { publicKey }]) => {
      return jose.exportJWK(publicKey).then(jwk => ({
        ...jwk,
        kid,
        use: 'sig',
        alg: 'RS256'
      }));
    });

    return Promise.all(keys);
  }
}

module.exports = new JWKSManager();
