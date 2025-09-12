import {iconValueFromSI, iconValueFromDataUrl} from "./utils";

import {
    siAwsfargate,
    siCodeberg,
    siDocker,
    siKubernetes,
    siNodedotjs,
    siPhp,
    siReact,
    siTypescript,
    siJavascript
} from "simple-icons";

import Linkedin from "@/assets/linkedin.svg";
import Resume from "@/assets/resume.svg";
import Email from "@/assets/email.svg";

export type IconValue = {
    svgString: string;
    color: string;
    title: string;
}

export const iconMapping: { [key: string]: IconValue } = {
    typescript: iconValueFromSI(siTypescript),
    node: iconValueFromSI(siNodedotjs),
    linkedin: iconValueFromDataUrl(Linkedin, "#0A66C2", "Linkedin"),
    aws: iconValueFromSI(siAwsfargate),
    kubernetes: iconValueFromSI(siKubernetes),
    php: iconValueFromSI(siPhp),
    codeberg: iconValueFromSI(siCodeberg),
    docker: iconValueFromSI(siDocker),
    react: iconValueFromSI(siReact),
    resume: iconValueFromDataUrl(Resume, "#FFF", "Resume"),
    contact: iconValueFromDataUrl(Email, "#FFF", "Contact"),
    javascript: iconValueFromSI(siJavascript)
};