// const canvas = document.getElementById('can');
// const gl = document.getContext('webgl');

function multiplyMatByVec(m, v) {
    let new_vec = new Float32Array(4);
    const m_length = 4;

    for (let i = 0; i < v.length; i++) {
        for (let j = 0; j < m_length; j++) {
            new_vec[i] += v[i] * m[j * m_length + i];
        }
    }
    return new_vec;
}

function identity() {
    let out = new Float32Array(16);

    out[0] = 1;
    out[5] = 1;
    out[10] = 1;
    out[15] = 1;

    return out;
}


