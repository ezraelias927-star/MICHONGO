

const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export async function apiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: BASE_HEADERS,
    credentials: 'same-origin' // MUHIMU: Inasafirisha Flask Session Cookies moja kwa moja
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(endpoint, options);
    
    // Kama Session ime-expire au mtumiaji hana ruhusa (401)
    if (response.status === 401) {
      return { success: false, unauthorized: true, error: "Tafadhali ingia tena kwenye mfumo." };
    }

    const result = await response.json();
    
    // Kama Flask imerudisha status ya makosa (mfano 400, 500)
    if (!response.ok) {
      return { 
        success: false, 
        error: result.error || result.errors?.join(', ') || "Kuna tatizo limetokea." 
      };
    }

    return result;

  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    return { success: false, error: "Imeshindikana kuunganisha na mtandao. Angalia intaneti yako." };
  }
}