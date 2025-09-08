export const calculateCaretPos = (input: HTMLInputElement, mirror: HTMLDivElement) => {
    // 1. CORRECT SELECTION HANDLING (fixes backward/forward selection)
    const caretPosition = input.selectionDirection === 'backward'
        ? (input.selectionStart || 0)
        : (input.selectionEnd || 0);

    // 2. UPDATE MIRROR CONTENT
    mirror.textContent = input.value.substring(0, caretPosition);

    // 3. GET ACTUAL LAYOUT MEASUREMENTS (NOT HARDCODED VALUES)
    const inputStyle = getComputedStyle(input);
    const paddingLeft = parseFloat(inputStyle.paddingLeft);
    const borderLeft = parseFloat(inputStyle.borderLeftWidth);
    const paddingRight = parseFloat(inputStyle.paddingRight);
    const borderRight = parseFloat(inputStyle.borderRightWidth);

    // 4. CALCULATE TRUE TEXT START POSITION
    const totalLeftOffset = borderLeft + paddingLeft;

    // 5. CALCULATE MAX VISIBLE POSITION (right edge of content area)
    const maxVisiblePosition = input.clientWidth - borderRight - paddingRight;

    // 6. CRITICAL: CONVERT TO VISIBLE COORDINATES USING SCROLL
    const rawPosition = totalLeftOffset + mirror.offsetWidth;
    const visiblePosition = rawPosition - input.scrollLeft;

    // 7. PROPER CLAMPING (prevents left/right overflow)
    const clampedPosition = Math.min(
        Math.max(visiblePosition, totalLeftOffset), // Prevent left overflow
        maxVisiblePosition                        // Prevent right overflow
    );

    return `${clampedPosition}px`;
}