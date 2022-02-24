import { useLocation } from "react-router-dom";

// get query params
// input: query param name
export function useQuery(){
  return new URLSearchParams(useLocation().search);
}