import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "el" | "en" | "bg";

const dictionary = {
  el: {
    menuTitle: "Το μενού μας", menuSubtitle: "ScanEat Menu", loading: "Φόρτωση Καταλόγου...",
    add: "Προσθήκη", portion: "Μερίδα:", individual: "Ατομικό:",
    ingredientsLabel: "Υλικά · αποεπιλέξτε όσα δεν θέλετε",
    specialInstructions: "Ειδικές Οδηγίες (Προαιρετικό)", instructionsPlaceholder: "π.χ. Χωρίς πολύ αλάτι, καλοψημένο...",
    update: "Ενημέρωση", soldOut: "Εξαντληθηκε", tempMissing: "⚠️ Χωρίς:",
    cartTitle: "Η Παραγγελία σας", emptyCart: "Το καλάθι σας είναι άδειο",
    total: "Σύνολο", checkout: "Αποστολή Παραγγελίας",
  },
  en: {
    menuTitle: "Our Menu", menuSubtitle: "ScanEat Menu", loading: "Loading Menu...",
    add: "Add", portion: "Portion:", individual: "Individual:",
    ingredientsLabel: "Ingredients · deselect what you don't want",
    specialInstructions: "Special Instructions (Optional)", instructionsPlaceholder: "e.g. No salt, well done...",
    update: "Update", soldOut: "Sold Out", tempMissing: "⚠️ Without:",
    cartTitle: "Your Order", emptyCart: "Your cart is empty",
    total: "Total", checkout: "Send Order",
  },
  bg: {
    menuTitle: "Нашето Меню", menuSubtitle: "ScanEat Меню", loading: "Зареждане...",
    add: "Добави", portion: "Порция:", individual: "Единична:",
    ingredientsLabel: "Съставки · премахнете тези, които не желаете",
    specialInstructions: "Специални инструкции (по избор)", instructionsPlaceholder: "напр. Без сол, добре изпечено...",
    update: "Обнови", soldOut: "Изчерпано", tempMissing: "⚠️ Без::",
    cartTitle: "Вашата поръчка", emptyCart: "Количката ви е празна",
    total: "Общо", checkout: "Изпрати поръчка",
  }
};

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof dictionary.el) => string;
  getLocalizedField: (item: any, fieldName: 'name' | 'description' | 'category') => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("el");

  useEffect(() => {
    const saved = localStorage.getItem("scaneat_lang") as Language;
    if (saved && (saved === "el" || saved === "en" || saved === "bg")) setLangState(saved);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("scaneat_lang", newLang);
  };

  const t = (key: keyof typeof dictionary.el) => dictionary[lang][key] || dictionary.el[key];

  const getLocalizedField = (item: any, fieldName: 'name' | 'description' | 'category') => {
    if (!item) return "";
    if (lang === "en" && item[`${fieldName}_en`]) return item[`${fieldName}_en`];
    if (lang === "bg" && item[`${fieldName}_bg`]) return item[`${fieldName}_bg`];
    return item[fieldName] || ""; 
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, getLocalizedField }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within an I18nProvider");
  return context;
}