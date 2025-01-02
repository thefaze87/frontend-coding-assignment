import React from "react";

export const MemoryRouter = ({ children }: { children: any }) => children;
export const Routes = ({ children }: { children: any }) => children;
export const Route = ({ element }: { element: any }) => element;
export const Link = ({ children }: { children: any }) => children;
export const useNavigate = () => jest.fn();
export const useParams = () => ({ id: "1" });
export const useSearchParams = () => [new URLSearchParams(), jest.fn()];
