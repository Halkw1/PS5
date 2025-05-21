
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t mt-auto bg-ps-darkgray text-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4 text-ps-lightorange">Loja PS5</h3>
            <p className="text-ps-lightgray text-sm">
              Sua loja para todos os jogos do PlayStation 5.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-ps-lightorange">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Todos os Jogos
                </Link>
              </li>
              <li>
                <Link to="/new-releases" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Lançamentos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-ps-lightorange">Atendimento ao Cliente</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/contact" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Informações de Envio
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-ps-lightorange">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-ps-lightgray hover:text-ps-orange transition-colors">
                  Política de Devolução
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ps-gray mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-ps-lightgray">
            &copy; {new Date().getFullYear()} Loja PS5. Todos os direitos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-ps-lightgray">Métodos de Pagamento:</span>
            <div className="flex space-x-2">
              <span className="text-xs bg-ps-gray px-2 py-1 rounded">Visa</span>
              <span className="text-xs bg-ps-gray px-2 py-1 rounded">MasterCard</span>
              <span className="text-xs bg-ps-gray px-2 py-1 rounded">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
