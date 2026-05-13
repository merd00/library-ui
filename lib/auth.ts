// JWT token'ı decode eder — payload kısmını okur
// Dikkat: bu doğrulama değil, sadece okuma
// Gerçek doğrulama backend'de yapılır
export function getTokenPayload(token: string): any {
  try {
    // JWT üç parça: header.payload.signature
    // Payload base64 encoded — decode edince JSON çıkar
    const base64Payload = token.split(".")[1];
    const decoded = atob(base64Payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  if (!token) return false;
  const payload = getTokenPayload(token);
  // ClaimTypes.Role → uzun bir string olarak geliyor
  return payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin";
}