function getAnimationDuration(element) {
    let style = window.getComputedStyle(element);
    let duration = style.transitionDuration;
    let delay = style.transitionDelay;
    let animationDuration = style.animationDuration;
    let animationDelay = style.animationDelay;

    duration = Math.round(
        duration.indexOf("ms") > -1
            ? parseFloat(duration)
            : parseFloat(duration) * 1000
    );
    delay = Math.round(
        delay.indexOf("ms") > -1 ? parseFloat(delay) : parseFloat(delay) * 1000
    );
    animationDuration = Math.round(
        animationDuration.indexOf("ms") > -1
            ? parseFloat(animationDuration)
            : parseFloat(animationDuration) * 1000
    );
    animationDelay = Math.round(
        animationDelay.indexOf("ms") > -1
            ? parseFloat(animationDelay)
            : parseFloat(animationDelay) * 1000
    );

    return Math.max(duration + delay, animationDuration + animationDelay);
}

export function animate(el, animationName, extraDelay) {
    if (el.$isAnimating) {
        clearAnimation(el);
    }

    el.$isAnimating = true;

    return new Promise(resolve => {
        let fromClass = `animate-${animationName}`;
        let toClass = `animate-${animationName}-end`;
        let activeClass = `animate-${animationName}-active`;

        el.$stopAnimation = () => {
            if (!el.$isAnimating) return;
            if (el.$animatecurrentTimeout) {
                clearTimeout(el.$animatecurrentTimeout);
            }
            if (el.$animationframerequest) {
                cancelAnimationFrame(el.$animationframerequest);
            }
            el.classList.remove(fromClass);
            el.classList.remove(toClass);
            el.classList.remove(activeClass);
            return resolve();
        };

        el.classList.add(fromClass);

        let performAnimation = () => {
            el.$animationframerequest = requestAnimationFrame(() => {
                el.$animationframerequest = null;
                el.classList.add(activeClass);

                return (el.$animationframerequest = requestAnimationFrame(() => {
                    el.$animationframerequest = null;
                    el.classList.add(toClass);
                    el.classList.remove(fromClass);

                    el.$animatecurrentTimeout = setTimeout(() => {
                        el.classList.remove(fromClass);
                        el.classList.remove(toClass);
                        el.classList.remove(activeClass);
                        el.$animatecurrentTimeout = null;
                        el.$stopAnimation = null;
                        el.$isAnimating = false;
                        return resolve();
                    }, getAnimationDuration(el));
                }));
            });
        };
        if (extraDelay) {
            el.$animatecurrentTimeout = extraDelay;
            return setTimeout(
                () => {
                    el.$animatecurrentTimeout = null;
                    performAnimation();
                },
                extraDelay ? extraDelay : 0
            );
        } else {
            return (el.$animationframerequest = requestAnimationFrame(() => {
                el.$animationframerequest = null;
                performAnimation();
            }));
        }
    });
}

export function animateStack(animationName, step, animateBlocks) {
    let promises = [];
    for (let i = 0; i < animateBlocks.length; i++) {
        promises.push(animateBlocks[i].animate(animationName, i * step));
    }

    return Promise.all(promises);
}

export function clearAnimation(el) {
    if (el.$stopAnimation) {
        el.$stopAnimation();
        el.$stopAnimation = null;
    }
}
