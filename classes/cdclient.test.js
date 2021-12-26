const cdclient = require("./cdclient")
// @ponicode
describe("removeNull", () => {
    let inst

    beforeEach(() => {
        inst = new cdclient()
    })

    test("0", () => {
        let result = inst.removeNull({})
        expect(result).toMatchSnapshot()
    })

    test("1", () => {
        let result = inst.removeNull(undefined)
        expect(result).toMatchSnapshot()
    })
})
