import React, {useState} from 'react'
import config from '../Svg/fontello/config.json'
import { CmpSvg } from '../cmpSvg/CmpSvg';
import { CmpField } from '../cmpFields/CmpField';
import { CmpListSvgProps } from './listSvg.types';

const CmpListSvg: React.FC <CmpListSvgProps> = ({
    svgClr = 'var(--primary-color)',
    svgSize = '32px',
    svgDefault = 'camera',
    nameSvg  = () => {},
}) => {
    const [selected, setSelected] = useState(svgDefault)
    const [listSvg, setListSvg] = useState(config.glyphs)


    const handleClick = (data:string) => {
        setSelected(data);
        nameSvg(data);
    }

    const filSome = (array: Array <any>, value: string, category:Array <string>) => {
         if (!array || !value) return array;
    
    const searchLower = value.toLowerCase();
    
    return array.filter(item => {
        return category.some(prop => {
            const valor = item[prop];
            return valor && typeof valor === 'string' && 
                   valor.toLowerCase().includes(searchLower);
        });
    });
    }

    const getFilter = (id: string, value: any ) => {

        const category = ['css']
     ///  const newList = listSvg.filter(listFilter => listFilter.css.includes(value) )
     const newList = filSome(config.glyphs, value, category)
        setListSvg(newList)
      //
        
    }
    
  return (
    <div className='container-list-svg'>
    <div className="searchSvg">
    <CmpField
        id='searchSvg'
        type='text'
        label='searchSvg'
        getValue={getFilter}
        />
   </div>
   <div className="template-list-svg">
     <div className='list-svg'>
    {
        listSvg.map((icon) => {
            return (
                <div key={icon.css} className= {`item-svg ${selected === icon.css ? 'item-svg-selected': ''}`}  onClick={() => handleClick(icon.css)} >
                    <CmpSvg
                        icon={icon.css} 
                        fontSize={svgSize} 
                        color={svgClr} 
                        title={icon.css} 
                        cursor='pointer'
                    />
                    <div >{icon.css}</div>
                </div>
            )
            
        })
      
    }
    </div>
   </div>
   
     </div>
  )
}

export  {CmpListSvg}