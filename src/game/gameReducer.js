import { ACTIONS } from "./actions";

function randomDie(){
    return Math.floor(Math.random() * 6) + 1;
}

function endIfWinOrTimeout(state) {
    if(state.score >= state.target) {
        return { ...state, phase: "gameover", message: "YOU WIN!"}
    }
    if(state.timeLeft <=0) {
        return { ...state, phase: "gameover",message: "TIME'S UP!"}
    }
    if(state.lives <= 0) {
        return { ...state, phase: "gameover", message: "OUT OF LIVES!"}
    } 
    return state;
}

export function gameReducer(state, action) {
    console.log("reducer", action.type, action)

    switch (action.type) {
        case ACTIONS.START: {
            return {
                ...state,
                phase: "playing",
                score: 0,
                round: 1,
                lives: 4,
                roll: null,
                pot: 0,
                timeLeft: 50,
                message: "Game on! Roll the die."
            };
        }

        case ACTIONS.ROLL: {
            if (state.phase !== "playing") return state;
            const rolled = randomDie();
            if (rolled === 1) {
                //bust round, lose a life, pot wiped
                const next ={
                    ...state,
                    roll: rolled,
                    pot: 0,
                    lives: state.lives -1,
                    round: state.round +1,
                    message: "Rolled! Life -1",
                };
                return endIfWinOrTimeout(next);
            }
            return {
                ...state,
                roll: rolled,
                pot: state.pot + rolled,
                message: `You rolled ${rolled}. Risk it or Hold it`,
            };
        }

        case ACTIONS.HOLD: {
            if (state.phase !== "playing") return state;
            const nextScore = state.score + state.pot;
            const next = {
                ...state,
                score: nextScore,
                pot: 0,
                round: state.round + 1,
                message: `Held ${state.pot} points`,
            };
            return endIfWinOrTimeout(next);
        }

        case ACTIONS.TICK: {
            if (state.phase !== "playing") return state;
            const next = { ...state, timeLeft: state.timeLeft -1 };
            return endIfWinOrTimeout(next);
        }

        case ACTIONS.LOSE_LIFE: {
            if (state.phase !== "playing") return state;
            const next = {
                ...state,
                lives: state.lives - 1,
                round: state.round + 1,
                pot: 0,
                message: "Life Lost!",
            };
            return endIfWinOrTimeout(next)
        }

        case ACTIONS.RESET: {
            return {
                phase: "idle",
                score: 0,
                round: 1,
                lives: 4,
                roll: null,
                pot: 0,
                target: 30,
                timeLeft: 50,
                message: "Press Start to Play",
            };
        }

        default:
            return state;
    }
}