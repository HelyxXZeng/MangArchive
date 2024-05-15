import './policies.scss';
import rules, {Rule} from '../../../public/Policies';
import { useNavigate } from 'react-router-dom';



const RulePage = () => {
    const navigate = useNavigate();

    const handleBack=() => navigate(-1);
    return (
      <div className="rule-page">
        
        <nav>
        <div className="headernav">
                <button className="backbutton" onClick={handleBack}>
                    <img src="/icons/arrow-left.svg" alt="" />
                </button>
                <div className="headerInfo">
                    <h2>Site Policiles</h2>
                </div>
        </div>
          <ul>
            {Object.keys(rules).map((sectionKey :any) => {
              const section = rules[sectionKey] as Rule;
              return (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="content customScrollbar">
          {Object.keys(rules).map((sectionKey : any) => {
            const section = rules[sectionKey] as Rule;
            return (
                <ol>
                    <li key={section.id}>
                        <h2 id={section.id.toString()}>{section.title}</h2>
                        {section.subRules && (
                        <ol>
                            {section.subRules.map((subRule) => (
                            <li key={subRule.id}>
                                <h3>{subRule.title}</h3>
                                <p>{subRule.content}</p>
                                {subRule.subSections && (
                                <ul>
                                    {subRule.subSections.map((subSection, index) => (
                                    <li key={index}>{subSection.content}</li>
                                    ))}
                                </ul>
                                )}
                            </li>
                            ))}
                        </ol>
                        )}
                    </li>                    
                    
                </ol>
            );
          })}
        </div>
      </div>
    );
  };
export default RulePage;
