import style from './style.module.scss'
import {classnames} from "@/utils/css";
import {calculateCaretPos} from "./caret";
import {mirrorTextStyles} from "./mirror";
import * as React from "react";
import { useRef, useEffect, ComponentPropsWithoutRef } from "react";

type InputEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement>
    | React.MouseEvent<HTMLInputElement>
    | React.KeyboardEvent<HTMLInputElement>;

type PromptProps = ComponentPropsWithoutRef<'input'>

export const CaretInput = ({ children, onChange, onFocus, onClick, onMouseDown, onMouseUp, className, ...rest }: PromptProps) => {
    const caretContainerRef = useRef<HTMLSpanElement>(null)
    const mirrorRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const combinedHandler = <E extends InputEvent>(
        originalHandler?: (event: E) => void, customHandler?: (event: E) => void
    ) => (event: E): void => {
        customHandler(event)
        originalHandler(event);
    }

    const updateCaret = () => caretContainerRef.current.style.left = calculateCaretPos(inputRef.current, mirrorRef.current);

    const toggleVisibility = (visible: boolean) =>
        () => caretContainerRef.current.style.visibility = visible ? "visible" : "hidden";

    useEffect(() => {
        mirrorTextStyles(inputRef.current, mirrorRef.current);
        updateCaret()
    }, []);

    return (
        <div className={style.container}>
            <input
                {...rest}
                className={classnames(style.input, className)}
                ref={inputRef}
                onChange={combinedHandler(onChange, updateCaret)} onFocus={combinedHandler(onFocus, updateCaret)} onClick={combinedHandler(onClick, updateCaret)}
                onMouseDown={combinedHandler(onMouseDown, toggleVisibility(false))}
                onMouseUp={combinedHandler(onMouseDown, toggleVisibility(true))}
            />
            <span ref={caretContainerRef} className={style.caretContainer}>
                {children || <span className={style.defaultCaret} /> }
            </span>
            <div className={style.mirror} ref={mirrorRef} />
        </div>
    )
};
