import styles from "../public/styles/index.module.css";
import RuleBuilder from "../components/rule";

export default function GetPassPage() { 
  return (
    <div className={styles.contain}>
      <RuleBuilder />      
    </div>
  );
}
