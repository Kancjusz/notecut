export function checkIfEmptyString(input,submit)
{
    if(input.value.length == 0)
    {
        input.classList.add("wrong");
        return true;
    }

    input.classList.remove("wrong");
    return false; 
}