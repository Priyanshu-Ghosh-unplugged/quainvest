import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const QUAISCAN_BASE_URL = "https://quaiscan.io/api";
const QUAI_RPC_URL = "https://rpc.quai.network/cyprus1/";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, type, rpcMethod, rpcParams } = await req.json();

    let response;
    let data;

    if (type === "rest") {
      // Quaiscan REST API call
      const url = `${QUAISCAN_BASE_URL}${endpoint}`;
      console.log(`Proxying REST request to: ${url}`);
      
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`REST API error: ${response.status} - ${errorText}`);
        return new Response(
          JSON.stringify({ error: `API error: ${response.status}`, details: errorText }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      data = await response.json();
    } else if (type === "rpc") {
      // Quai RPC call
      console.log(`Proxying RPC request: ${rpcMethod}`);
      
      const rpcRequest = {
        jsonrpc: "2.0",
        method: rpcMethod,
        params: rpcParams || [],
        id: Date.now(),
      };

      response = await fetch(QUAI_RPC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rpcRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`RPC error: ${response.status} - ${errorText}`);
        return new Response(
          JSON.stringify({ error: `RPC error: ${response.status}`, details: errorText }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      data = await response.json();
      
      // Handle RPC-level errors
      if (data.error) {
        console.error(`RPC method error: ${JSON.stringify(data.error)}`);
        return new Response(
          JSON.stringify({ error: data.error.message, code: data.error.code }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Return just the result for RPC calls
      data = { result: data.result };
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid request type. Use 'rest' or 'rpc'" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Proxy error: ${message}`);
    return new Response(
      JSON.stringify({ error: message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
