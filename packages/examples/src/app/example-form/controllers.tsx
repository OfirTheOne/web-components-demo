import Sig from "sig";

export const Input: Sig.FC<
    { value: Sig.Signal<string> } & 
    Omit<JSX.HTMLAttributes<HTMLInputElement>, 'value'>
> = ({value, ...props}) => {  
    return (
        <input 
            value={(value) as unknown as string}
            list={props.list}
            onInput={(e) => value.setValue(() => e.target.value) }
            {...props} />
    );
}

export const Dropdown: Sig.FC<{ 
    value: Sig.Signal<string>, 
    options: string[],
    key: string
}> = ({value, options, key, ...props}) => {
    return (
        
        <div>
            <datalist id={"list_"+key}> 
                { options.map((option) => <option value={option}/>) }
            </datalist>
            <Input 
                value={value} 
                onChange={(e) => value.setValue(() => e.target.value) }
                list={"list_"+key} 
                { ...props }
            />
        </div>
            

    );
}

